// @ts-ignore
import React, {Component} from 'react';
import {Address} from "./utils";
import {Ctf, GsnStatusInfo} from "@ctf/eth/src/Ctf";

declare let global: { network: any }

interface GsnStatusState {
  relayHubAddress?: string
  totalRelayers?: string
  paymasterAddress?: string
  paymasterBalance?: string
  forwarderAddress?: string
}

interface GsnStatusProps {
  ctf?: Ctf
}

export class GsnStatus extends Component<GsnStatusProps, GsnStatusState> {
  ctf: Ctf

  state: GsnStatusState = {}

  constructor(props: GsnStatusProps) {
    super(props)
    this.ctf = props.ctf!
  }


  async initProvider() {
    // @ts-ignore
    if (!this.ctf.gsnProvider.relayClient.initialized) {
      console.log('not initialized. calling provider.init')
      await this.ctf.gsnProvider.init()
      console.log('after provider.init')
    }
  }

  async init() {
    const setState = this.setState.bind(this)
    console.log('== init before')
    await this.initProvider()
    //update UI after each TX (paymaster balance, active relayers)
    this.ctf.listenToEvents(e=>this.updateDynamicInfo())
    const gsnStatus = await this.ctf.getGsnStatus()
    console.log('== after getGsnStatus', gsnStatus)
    setState({
      relayHubAddress: gsnStatus.relayHubAddress,
      forwarderAddress: gsnStatus.forwarderAddress,
      paymasterAddress: gsnStatus.paymasterAddress,
    })
    await this.updateDynamicInfo(gsnStatus)
  }

  async updateDynamicInfo(gsnStatus?: GsnStatusInfo) {
    if (gsnStatus === undefined) {
      gsnStatus = await this.ctf.getGsnStatus()
    }
    gsnStatus.getPaymasterBalance().then(bal => {
      const b = parseFloat(bal.toString())
      this.setState({
        paymasterBalance: (b / 1e18).toFixed(6)
      })
    })
    gsnStatus.getActiveRelayers().then(count => {
      this.setState({
        totalRelayers: count.toString()
      })
    })
  }

  componentDidMount() {
    this.init().then()
  }

  render() {
    const {relayHubAddress, totalRelayers, paymasterAddress, paymasterBalance, forwarderAddress} = this.state

    return (
      // @ts-ignore
      <table border={1}
             style={{textAlign: "left"}}>
        <tbody>
        <tr>
          <td>
            <b>GSN Contracts Status:</b><br/>
            Current network: <b>{global.network.name}</b><br/>
            RelayHub <Address addr={relayHubAddress}/> {totalRelayers && <>relayers: {totalRelayers}</>}<br/>
            Paymaster <Address addr={paymasterAddress}/> balance: {paymasterBalance} <br/>
            Forwarder <Address addr={forwarderAddress}/><br/>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}