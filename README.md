# Solana Ultra-Fast Copy-Trader 🚀

A high-performance Node.js copy-trading bot for Solana that executes trades with minimal latency, checks on-chain liquidity, and parses external signals via AI/ML.

## Features

- **Ultra-Fast Execution**: Optimized for <200ms response times
- **Multi-DEX Support**: Raydium, Orca, Meteora, Lifinity, PumpFun
- **On-Chain Liquidity Analysis**: Real-time orderbook depth and slippage calculations
- **AI Signal Parsing**: Telegram integration with ML-based signal extraction
- **IDL Integration**: Dynamic loading of 9 DEX program IDLs
- **Safety Features**: Max trade limits, slippage protection, dry-run mode
- **Performance Monitoring**: Built-in metrics and logging

## Project Structure

```
solana-copy-trader/
├── config/
│   ├── index.js          # Configuration loader
│   └── env.example       # Environment template
├── src/
│   ├── blockchainConnector/  # Solana RPC interface
│   ├── buyFunction/          # Trade execution logic
│   ├── liquidityChecker/     # DEX liquidity analysis
│   ├── signalEngine/         # Telegram signal parser
│   ├── idlIntegration/       # Anchor program interface
│   ├── utils/                # Helpers and logging
│   └── index.js             # Main entry point
├── idls/                     # DEX program IDLs
├── tests/                    # Unit tests
├── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Node.js >= 18
- Solana wallet with SOL for trading
- One of the following RPC options:
  - **Vision Node** (local Solana node) - Fastest option
  - **Custom RPC** (Helius, QuickNode, etc.) - Good performance
  - **Public RPC** - Free but slower
- Telegram bot token (optional for signals)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd solana-copy-trader

# Install dependencies
npm install

# Copy environment template
cp config/env.example .env

# Edit .env with your settings
nano .env
```

### RPC Configuration

Test available RPC endpoints:
```bash
npm run test-rpc
```

Configure your RPC in `.env`:

```bash
# RPC Provider Options
RPC_PROVIDER=auto  # Options: vision, custom, public, auto

# Option 1: Vision Node (Fastest - if you have local node)
RPC_URL=http://localhost:8899

# Option 2: Custom RPC (Good performance)
# RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY

# Option 3: Fallback RPC (backup option)
FALLBACK_RPC_URL=https://api.mainnet-beta.solana.com

# Wallet Configuration
WALLET_PATH=/path/to/wallet.json
MAX_SOL_PER_TRADE=0.1

# Trading Parameters
AUTO_TRADE_ENABLED=false  # Set to true for live trading
DRY_RUN_MODE=true         # Set to false for real trades

# Liquidity Requirements
MIN_LIQUIDITY_USD=50000
MAX_SLIPPAGE_PERCENT=2.0

# Telegram User Authentication
TELEGRAM_API_ID=12345678              # Get from https://my.telegram.org
TELEGRAM_API_HASH=your_api_hash_here  # Get from https://my.telegram.org
TELEGRAM_PHONE_NUMBER=+1234567890     # Your phone number (optional)
TELEGRAM_SESSION_STRING=              # Leave empty on first run
```

### Setting up Vision Node (Recommended)

For best performance, run a local Vision node:

```bash
# Install Solana CLI if not already installed
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Start Vision node (mainnet-beta)
solana-test-validator --url https://api.mainnet-beta.solana.com --clone-upgradeable-programs

# Or for a full mainnet node
solana-validator --entrypoint mainnet-beta.solana.com:8001
```

Once running, the bot will automatically detect and use your Vision node for ultra-fast execution.

### Setting up Telegram User Authentication

The bot connects to your personal Telegram account to monitor channels you're subscribed to:

1. **Get API Credentials**:
   - Go to https://my.telegram.org
   - Sign in with your phone number
   - Go to "API Development Tools"
   - Create a new application
   - Copy the `api_id` and `api_hash`

2. **Configure in .env**:
   ```bash
   TELEGRAM_API_ID=your_api_id
   TELEGRAM_API_HASH=your_api_hash
   TELEGRAM_PHONE_NUMBER=+1234567890  # Optional, speeds up login
   ```

3. **First Run**:
   - Start the bot: `npm start`
   - Enter your phone number when prompted
   - Enter the verification code sent to Telegram
   - The bot will list all your channels/groups
   - Select which ones to monitor for signals
   - Save the session string shown in logs to `TELEGRAM_SESSION_STRING` in .env

4. **Subsequent Runs**:
   - With session string saved, no login required
   - Bot automatically monitors selected channels

## Usage

### Manual Trading Test

```bash
# Run a test trade (dry-run by default)
npm run buy-test
```

### Start Copy-Trader

```bash
# Start the main trading bot
npm start
```

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

## Module Documentation

### 1. BlockchainConnector (`/src/blockchainConnector`)

Singleton module managing all Solana RPC interactions.

```javascript
import blockchainConnector from './blockchainConnector/index.js';

// Initialize connection
await blockchainConnector.initialize();

// Get token info
const tokenInfo = await blockchainConnector.getTokenInfo(mintAddress);
// Returns: { name, symbol, decimals, supply }

// Get latest slot
const slot = await blockchainConnector.getLatestSlot();
```

### 2. BuyFunction (`/src/buyFunction`)

Executes token purchases across multiple DEXs.

```javascript
import buyFunction from './buyFunction/index.js';

// Initialize
await buyFunction.initialize();

// Execute a buy
const result = await buyFunction.buy(
  tokenMint,    // Token address
  amountSol,    // SOL to spend
  {
    dex: 'raydium',      // Optional: specific DEX
    slippageBps: 100     // Optional: slippage in basis points
  }
);
```

### 3. LiquidityChecker (`/src/liquidityChecker`)

Analyzes liquidity across all supported DEXs.

```javascript
import liquidityChecker from './liquidityChecker/index.js';

// Check liquidity
const liquidity = await liquidityChecker.checkLiquidity(tokenMint, amountSol);
// Returns: { price, depth, slippage, bestDex, dexResults }

// Verify requirements
const meetsReqs = liquidityChecker.meetsRequirements(liquidity);

// Get quote
const quote = await liquidityChecker.getQuote(tokenMint, amountSol, 'raydium');
```

### 4. SignalEngine (`/src/signalEngine`)

Listens to Telegram channels and executes trades based on signals.

```javascript
import signalEngine from './signalEngine/index.js';

// Start listening
await signalEngine.listenAndExecute();

// Get history
const recentSignals = signalEngine.getHistory(100);
```

Signal formats supported:
- `BUY $TOKEN CA: <address> Amount: X SOL`
- `🚀 <address> - Buy with X SOL`
- `Token: <address> | Entry: X SOL`
- `CA: <address> (Buy: X SOL)`

### 5. IDLIntegration (`/src/idlIntegration`)

Manages Anchor program interactions for all DEXs.

```javascript
import idlIntegration from './idlIntegration/index.js';

// Initialize
await idlIntegration.initialize();

// Get available programs
const programs = idlIntegration.getAvailablePrograms();

// Call custom method
const txId = await idlIntegration.callCustomMethod(
  'raydium_amm',
  'swap',
  [amountIn, minAmountOut],
  { user, pool, tokenProgram }
);
```

## Performance Optimization

1. **Connection Pooling**: Single RPC connection instance
2. **Parallel Fetching**: Multi-DEX liquidity checks run concurrently
3. **Caching**: Token info cached for 5 minutes, liquidity for 10 seconds
4. **Compute Units**: Configurable priority fees for faster inclusion
5. **WebSocket**: Real-time updates when available

## Safety Features

- **Dry Run Mode**: Test without executing real trades
- **Max Trade Limits**: Configurable per-trade SOL cap
- **Slippage Protection**: Automatic minimum output calculation
- **Duplicate Detection**: Prevents processing same signal twice
- **Graceful Shutdown**: Proper cleanup on exit

## Supported DEXs

| DEX | IDL | Status |
|-----|-----|--------|
| Raydium | ✅ 3 variants | Simulated |
| Orca | ✅ Whirlpool | Simulated |
| Meteora | ✅ AMM + CLMM | Simulated |
| Lifinity | ✅ | Simulated |
| PumpFun | ✅ | Simulated |

*Note: Actual DEX integrations require implementing the swap logic with their SDKs*

## Development

### Adding a New DEX

1. Add IDL to `/idls/` folder
2. Update program ID mapping in `idlIntegration/index.js`
3. Implement liquidity check in `liquidityChecker/index.js`
4. Add swap logic in `buyFunction/index.js`

### Logging

Uses Pino for high-performance logging:

```javascript
import logger from './utils/logger.js';

logger.info('Info message');
logger.trade('buy_executed', { token, amount });
logger.liquidity(tokenMint, liquidityData);
logger.performance('operation_name', durationMs);
```

## Troubleshooting

### Common Issues

1. **"Missing required environment variables"**
   - Ensure `WALLET_PATH` is set in `.env`

2. **"Token mint not found"**
   - Verify the token address is valid on Solana

3. **"Insufficient balance"**
   - Ensure wallet has enough SOL + 0.01 for fees

4. **Telegram not receiving signals**
   - Check bot token is valid
   - Verify channel IDs (must include `-` prefix)

### Debug Mode

Enable detailed logging:
```bash
LOG_LEVEL=debug npm start
```

## Security Considerations

- **Never commit** `.env` or wallet files
- **Use read-only** RPC endpoints when possible
- **Enable MEV protection** in production
- **Set reasonable** trade limits
- **Monitor** for unusual activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Disclaimer

This software is for educational purposes. Trading cryptocurrencies involves substantial risk. Always do your own research and never trade more than you can afford to lose.