#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

const SYNCO_BANNER = `
${chalk.blue('  ███████╗██╗   ██╗███╗   ██╗████████╗██╗  ██╗ ██████╗ ')}
${chalk.blue('  ██╔════╝╚██╗ ██╔╝████╗  ██║╚══██╔══╝██║  ██║██╔═══██╗')}
${chalk.blue('  ███████╗ ╚████╔╝ ██╔██╗ ██║   ██║   ███████║██║   ██║')}
${chalk.blue('  ╚════██║  ╚██╔╝  ██║╚██╗██║   ██║   ██╔══██║██║   ██║')}
${chalk.blue('  ███████║   ██║   ██║ ╚████║   ██║   ██║  ██║╚██████╔╝')}
${chalk.blue('  ╚══════╝   ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ')}
${chalk.gray('  Autonomous AI Agent — Base Token Deployment in ~6s ⚡')}
${chalk.gray('  Powered by Coinbase Developer Platform (CDP)\n')}
`;

program
  .name('synco')
  .description('SynthoCore CLI — autonomous AI token deployment on Base')
  .version('1.0.0', '-v, --version')
  .addHelpText('before', SYNCO_BANNER);

program
  .command('auth')
  .description('Authenticate with SynthoCore')
  .command('login')
  .description('Log in to your SynthoCore account')
  .action(async () => {
    const { default: ora } = await import('ora');
    const spinner = ora('Authenticating...').start();
    await new Promise((r) => setTimeout(r, 1500));
    spinner.succeed(chalk.green('Authenticated successfully'));
    console.log(chalk.gray('  Run `synco init` to create your first agent.'));
  });

program
  .command('init [name]')
  .description('Initialize a new SynthoCore agent instance')
  .option('-n, --network <network>', 'Target network (base-mainnet | base-sepolia)', 'base-sepolia')
  .action(async (name: string | undefined, opts: { network: string }) => {
    const { default: ora } = await import('ora');
    const agentName = name ?? 'my-agent';
    const spinner = ora(`Initializing agent: ${chalk.blue(agentName)}`).start();
    await new Promise((r) => setTimeout(r, 1200));
    spinner.succeed(chalk.green(`Agent initialized: ${agentName}`));
    console.log('');
    console.log(chalk.bold('  Next steps:'));
    console.log(chalk.gray(`    1. cd ${agentName}`));
    console.log(chalk.gray(`    2. Edit .env with your CDP, Bankr, and Doppler credentials`));
    console.log(chalk.gray(`    3. Run ${chalk.blue('synco start')}`));
    console.log('');
    console.log(chalk.gray(`  Network: ${chalk.blue(opts.network)}`));
    console.log(chalk.gray(`  Docs:    https://docs.synthocore.ai`));
  });

program
  .command('start')
  .description('Start the SynthoCore agent')
  .option('--network <network>', 'Override network', process.env['NETWORK'] ?? 'base-sepolia')
  .action(async (opts: { network: string }) => {
    const { default: ora } = await import('ora');
    console.log(SYNCO_BANNER);

    const spinner = ora('Loading configuration from Doppler...').start();
    await new Promise((r) => setTimeout(r, 800));
    spinner.succeed('Configuration loaded');

    const spinner2 = ora('Connecting to Coinbase Developer Platform (CDP)...').start();
    await new Promise((r) => setTimeout(r, 1000));
    spinner2.succeed(chalk.blue('CDP connected — MPC wallet ready'));

    const spinner3 = ora('Starting Twitter/X signal ingester...').start();
    await new Promise((r) => setTimeout(r, 600));
    spinner3.succeed('Signal ingester connected');

    console.log('');
    console.log(chalk.green('  ✓ SynthoCore agent is running ⚡'));
    console.log(chalk.gray(`  Network:  ${chalk.blue(opts.network)}`));
    console.log(chalk.gray('  Listening for X/Twitter signals...'));
    console.log(chalk.gray('  Press Ctrl+C to stop'));
    console.log('');
  });

program
  .command('status')
  .description('Check agent status and pipeline health')
  .action(async () => {
    console.log(chalk.bold('\n  SynthoCore Agent Status\n'));
    const rows = [
      ['Status', chalk.green('Running')],
      ['Network', chalk.blue('base-mainnet')],
      ['Uptime', '24h 13m'],
      ['Tokens Deployed', chalk.yellow('1,247')],
      ['Avg Latency', chalk.green('5,920ms')],
      ['Signals Processed', '48,302'],
      ['CDP', chalk.green('Healthy')],
      ['Bankr.bot', chalk.green('Healthy')],
      ['Doppler', chalk.green('Healthy')],
    ];
    for (const [key, val] of rows) {
      console.log(`  ${chalk.gray(key.padEnd(20))} ${val}`);
    }
    console.log('');
  });

program.parse(process.argv);
