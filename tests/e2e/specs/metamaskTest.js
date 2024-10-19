require('dotenv').config();


const tc_url = "https://d1ehnmemk3.execute-api.us-east-1.amazonaws.com/qa/api/finishMetamaskReleaseVerify"
let fromAddress = "0x42533097134342135901d840eE124E666C7f6092"
const gf_balance_path = "https://gnfd-testnet-fullnode-tendermint-us.bnbchain.org/cosmos/bank/v1beta1/balances/" + fromAddress
const payload = {
    metamaskVersion: '',
    workflowRunId: '',
    gfCheckResult: '',
    bscCheckResult:'',
    opCheckResult:'',
    resultData: '',
    passCount: 0,
    failCount: 0,
    skipCount: 0,
}
let testResultArray =[]

//0x42533097134342135901d840eE124E666C7f6092
//0x4cD391f38331016556CE29B422DbdC21Bb3687aE
describe('metamask release verify', () => {
    before(function () {
        cy.log("===before first test case===");
        if (Cypress.env('RUN_ID') && !isNaN(Cypress.env('RUN_ID'))){
            cy.log("RUN_ID:", Cypress.env('RUN_ID'))
            cy.log("METAMASK_VERSION", Cypress.env('METAMASK_VERSION'))
            payload.metamaskVersion = Cypress.env('METAMASK_VERSION')
            payload.workflowRunId = Cypress.env('RUN_ID')
            payload.workflowRunId = payload.workflowRunId.toString().replaceAll(', ', '')
            cy.log("RUN_ID:", payload.workflowRunId)
        }
    });
    after(function () {
        cy.log("=== After last test case===");
        if (Cypress.env('RUN_ID') && !isNaN(Cypress.env('RUN_ID'))) {
            payload.resultData = JSON.stringify(testResultArray)
            cy.log("************", payload)
            cy.request('POST', tc_url, payload).then(
                res => {
                    cy.log('Success:', res.body);
                }
            )
        }
    });
    afterEach(function(){
        if (this.currentTest.state == 'failed'){
            payload.failCount++
        }else {
            payload.passCount++
        }
        testResultArray.push({name:this.currentTest.title, state: this.currentTest.state, error: this.currentTest.err})
        switch (this.currentTest.title){
            case 'Greenfield':
                payload.gfCheckResult = this.currentTest.state
                break
            case 'bsc':
                payload.bscCheckResult = this.currentTest.state
                break
            case 'op':
                payload.opCheckResult = this.currentTest.state
                break
        }
    });

    // it('Greenfield', () => {
    //     cy.log("**************00")
    //     cy.visit("https://testnet.dcellar.io/")
    //     cy.get('button').contains('Get Started').click()
    //     cy.get('button').contains('MetaMask').click()
    //     cy.log("**************0")
    //     cy.acceptMetamaskAccess({
    //         confirmSignatureRequest: true,
    //         confirmDataSignatureRequest: true,
    //         allAccounts: true,
    //         switchNetwork: true
    //     })
    //     let originalBalance = 0
    //     cy.request('GET', gf_balance_path).then(
    //         res => {
    //             cy.log("***********", JSON.stringify(res.body))
    //             if (res && res.body.balances) {
    //                 const amount = res.body.balances[0].amount
    //                 originalBalance = amount / 1000000000000000000
    //             } else {
    //                 cy.log('***********get current balance failed')
    //                 expect(true).to.eq(false)
    //             }
    //         }
    //     )
    //     cy.log("**************1")
    //     cy.get('span').contains('Wallet').click()
    //     cy.log("**************2")
    //     cy.get('div').contains('Send').click()
    //     cy.get('input[placeholder="Choose or enter addresses"]').type('0x4cD391f38331016556CE29B422DbdC21Bb3687aE{enter}')
    //     cy.get('label').contains('To').click()
    //     cy.wait(3 * 1000)
    //     cy.get('div.ui-lazy-box[style="display: block;"] #amount').type('0.00000001')
    //     cy.wait(3 * 1000)
    //     cy.get('div.ui-lazy-box[style="display: block;"] button').contains('Send').click()
    //     cy.confirmMetamaskSignatureRequest()
    //     cy.wait(15 * 1000)
    //     cy.get('p').contains('Transaction Submitted').should('be.visible')
    //     cy.request('GET', gf_balance_path).then(
    //         res => {
    //             cy.log("***********", JSON.stringify(res.body))
    //             if (res && res.body.balances) {
    //                 const amount = res.body.balances[0].amount
    //                 const currentBalance = amount / 1000000000000000000
    //                 expect((originalBalance - currentBalance).toFixed(8)).to.eq('0.00000601')
    //             } else {
    //                 cy.log('***********get current balance failed')
    //                 expect(true).to.eq(false)
    //             }
    //         }
    //     )
    //     cy.wait(5 * 1000)
    // });

    it('bsc', () => {
        cy.initPlaywright().then(isConnected => {
            expect(isConnected).to.be.true;
        });
        cy.switchToMetamaskWindow()
        cy.isMetamaskWindowActive().then(isActive => {
            expect(isActive).to.be.true;
        });
        cy.addMetamaskNetwork({
            networkName: 'BSC Test Net',
            rpcUrl: 'https://bsc-testnet.bnbchain.org',
            chainId: 97,
            symbol: 'tBNB',
            blockExplorer: 'https://testnet.bscscan.com',
            isTestnet:true}
        )
        cy.screenshot('test-screenshot')
        cy.changeMetamaskNetwork('BSC Test Net')
        cy.screenshot('test-screenshot1')
        cy.metamaskScreenshot('test-screenshot1.png')
        cy.sendNativeTx({toAccount: "0x4cD391f38331016556CE29B422DbdC21Bb3687aE", amount:"0.00000001"}).then(res => {
            expect(res).to.be.true
        })


    })
})