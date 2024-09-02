import assets from '../../../../fixtures/assets.json';
import constants from '../../../../fixtures/constans.json';
import { skipState } from '../../../../support/steps/common';
import { configEnvWithTenderlyAEthereumV3Fork } from '../../../../support/steps/configuration.steps';
import { borrow, repay, supply, withdraw } from '../../../../support/steps/main.steps';
import {
  dashboardAssetValuesVerification,
  switchApyBlocked,
} from '../../../../support/steps/verification.steps';
import { RequestedTokens, tokenSet } from '../../../4-gho-ethereum/helpers/token.helper';

const tokensToRequest: RequestedTokens = {
  aETHEthereumV3: 900,
};

const testData = {
  testCases: {
    borrow: [
      {
        asset: assets.ethereumV3Market.WBTC,
        amount: 0.05,
        apyType: constants.borrowAPYType.default,
        hasApproval: true,
      },
    ],
    deposit: {
      asset: assets.ethereumV3Market.WBTC,
      amount: 0.0101,
      hasApproval: false,
    },
    checkDisabledApy: {
      asset: assets.ethereumV3Market.WBTC,
      apyType: constants.apyType.variable,
    },
    repay: [
      {
        asset: assets.ethereumV3Market.WBTC,
        apyType: constants.apyType.variable,
        amount: 0.002,
        hasApproval: true,
        repayOption: constants.repayType.default,
      },
      {
        asset: assets.ethereumV3Market.WBTC,
        apyType: constants.apyType.variable,
        repayableAsset: assets.ethereumV3Market.aWBTC,
        amount: 0.002,
        hasApproval: true,
        repayOption: constants.repayType.default,
      },
    ],
    withdraw: {
      asset: assets.ethereumV3Market.WBTC,
      isCollateral: true,
      amount: 0.001,
      hasApproval: true,
    },
  },
  verifications: {
    finalDashboard: [
      {
        type: constants.dashboardTypes.deposit,
        assetName: assets.ethereumV3Market.WBTC.shortName,
        amount: 0.007,
        collateralType: constants.collateralType.isCollateral,
        isCollateral: true,
      },
      {
        type: constants.dashboardTypes.borrow,
        assetName: assets.ethereumV3Market.WBTC.shortName,
        amount: 0.046,
        apyType: constants.borrowAPYType.variable,
      },
    ],
  },
};

describe('WBTC INTEGRATION SPEC, ETHEREUM V3 MARKET', () => {
  const skipTestState = skipState(false);
  configEnvWithTenderlyAEthereumV3Fork({
    v3: true,
    tokens: tokenSet(tokensToRequest),
  });

  testData.testCases.borrow.forEach((borrowCase) => {
    borrow(borrowCase, skipTestState, true);
  });
  switchApyBlocked(testData.testCases.checkDisabledApy, skipTestState);
  supply(testData.testCases.deposit, skipTestState, true);
  testData.testCases.repay.forEach((repayCase) => {
    repay(repayCase, skipTestState, false);
  });
  withdraw(testData.testCases.withdraw, skipTestState, false);
  dashboardAssetValuesVerification(testData.verifications.finalDashboard, skipTestState);
});
