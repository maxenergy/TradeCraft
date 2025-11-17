import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

// Store working directories per session (in production, use Redis or similar)
const workingDirectories = new Map<string, string>();

// Security: Allowed base directory (restrict to project directory)
const BASE_DIR = process.env.TERMINAL_BASE_DIR || process.cwd();

export async function POST(request: NextRequest) {
  try {
    const { command, sessionId = 'default' } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Invalid command', output: '' },
        { status: 400 }
      );
    }

    // Get or initialize working directory for this session
    let cwd = workingDirectories.get(sessionId) || BASE_DIR;

    // Handle cd command separately to track directory changes
    if (command.trim().startsWith('cd ')) {
      const targetDir = command.trim().substring(3).trim() || '~';

      try {
        // Resolve target directory
        let newDir: string;
        if (targetDir === '~') {
          newDir = BASE_DIR;
        } else if (path.isAbsolute(targetDir)) {
          newDir = targetDir;
        } else {
          newDir = path.resolve(cwd, targetDir);
        }

        // Security check: ensure new directory is within BASE_DIR
        if (!newDir.startsWith(BASE_DIR)) {
          return NextResponse.json({
            output: `Access denied: Cannot navigate outside project directory`,
            error: true,
            cwd: cwd.replace(BASE_DIR, '~'),
          });
        }

        // Verify directory exists
        const { stdout: lsOutput } = await execAsync(`ls -la "${newDir}"`, { cwd: BASE_DIR });

        // Update working directory
        workingDirectories.set(sessionId, newDir);

        return NextResponse.json({
          output: `Changed directory to ${newDir.replace(BASE_DIR, '~')}`,
          error: false,
          cwd: newDir.replace(BASE_DIR, '~'),
        });
      } catch (error: any) {
        return NextResponse.json({
          output: `cd: ${targetDir}: No such file or directory`,
          error: true,
          cwd: cwd.replace(BASE_DIR, '~'),
        });
      }
    }

    // Security: Block dangerous commands
    const dangerousCommands = [
      'rm -rf /',
      'mkfs',
      'dd if=',
      '> /dev/sda',
      'fork bomb',
      ':(){ :|:& };:',
    ];

    if (dangerousCommands.some(dangerous => command.includes(dangerous))) {
      return NextResponse.json(
        {
          error: true,
          output: 'Security: Dangerous command blocked',
          cwd: cwd.replace(BASE_DIR, '~'),
        },
        { status: 403 }
      );
    }

    // Execute command with timeout
    const { stdout, stderr } = await execAsync(command, {
      cwd,
      timeout: 30000, // 30 second timeout
      maxBuffer: 1024 * 1024, // 1MB max output
    });

    const output = stdout || stderr || 'Command executed successfully';

    return NextResponse.json({
      output: output.trim(),
      error: !!stderr,
      cwd: cwd.replace(BASE_DIR, '~'),
    });

  } catch (error: any) {
    // Handle command execution errors
    const errorMessage = error.stderr || error.message || 'Command execution failed';

    return NextResponse.json({
      output: errorMessage.trim(),
      error: true,
      cwd: (workingDirectories.get('default') || BASE_DIR).replace(BASE_DIR, '~'),
    });
  }
}
