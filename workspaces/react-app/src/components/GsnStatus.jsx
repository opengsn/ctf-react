import React, {useState} from 'react';
import {Address} from "./utils";

export class GsnStatus extends React.Component {
    constructor({provider}) {
        super()
        this.gsnProvider = provider
        this.state = {}
    }


    async initProvider() {
        if (!this.gsnProvider.relayClient.initialized) {
            await this.gsnProvider.init()
        }
        return this.gsnProvider
    }

    init() {
        const setState = this.setState.bind(this)
        this.initProvider().then(gsnProvider => {
            let relayClient = gsnProvider.relayClient;
            const ci = relayClient.dependencies.contractInteractor
            setState({
                relayHubAddress: ci.relayHubInstance.address,
                forwarderAddress: ci.forwarderInstance.address,
                paymasterAddress: ci.paymasterInstance.address
            })
            ci.paymasterInstance.getRelayHubDeposit().then(bal => {
                setState({
                    paymasterBalance: (bal / 1e18).toFixed(6)
                })
            })
            relayClient.dependencies.knownRelaysManager.refresh().then(() => {
                setState({
                    totalRelayers: relayClient.dependencies.knownRelaysManager.allRelayers.length
                })
            })
        })
    }

    componentDidMount() {
        this.init()
    }

    render() {
        const {relayHubAddress, totalRelayers, paymasterAddress, paymasterBalance, forwarderAddress} = this.state

        return (
                <table border={1}
                    style={{textAlign: "left"}}>
                <tbody><tr><td>
                    <b>GSN Contracts Status:</b><br/>
                    Current network: {global.network.name}<br/>
                     RelayHub <Address addr={relayHubAddress}/> {totalRelayers && <>relayers: {totalRelayers}</>}<br/>
                     Paymaster <Address addr={paymasterAddress}/> balance: {paymasterBalance} <br/>
                     Forwarder <Address addr={forwarderAddress}/><br/>
                </td></tr></tbody></table>
        );
    }
}