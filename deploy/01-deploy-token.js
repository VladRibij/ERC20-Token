const { network } = require("hardhat")
const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS, INITIAL_SUPPLY } = require("../helper-hardhat-config")
const { verify } = require("../verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  const waitBlockConfirmations = developmentChains.includes(network.name) ? 1 : VERIFICATION_BLOCK_CONFIRMATIONS

  log("----------------------------------------------------")

  const OurToken = await deploy("OurToken", {
    from: deployer,
    args: [INITIAL_SUPPLY],
    log: true,
    waitConfirmations: waitBlockConfirmations,
  })

  log(`ourToken deployed at ${OurToken.address}`)

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(OurToken.address, [INITIAL_SUPPLY])
  }
}

module.exports.tags = ["all", "token"]
