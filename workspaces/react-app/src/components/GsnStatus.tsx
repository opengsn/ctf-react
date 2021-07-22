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


  async initProvider(): Promise<GsnStatusInfo> {
    // @ts-ignore
    if (!this.ctf.gsnProvider.relayClient.initialized) {
      console.log('not initialized. calling provider.init')
      await this.ctf.gsnProvider.init()
      console.log('after provider.init')
    }
    return await this.ctf.getGsnStatus()
  }

  init() {
    const setState = this.setState.bind(this)
    console.log('== init before')
    this.initProvider().then(gsnStatus => {
      console.log('== after getGsnStatus', gsnStatus)
      setState({
        relayHubAddress: gsnStatus.relayHubAddress,
        forwarderAddress: gsnStatus.forwarderAddress,
        paymasterAddress: gsnStatus.paymasterAddress,
      });
      gsnStatus.getPaymasterBalance().then(bal => {
        const b= parseFloat(bal.toString())
        console.log('bal=', b)
        setState({
          paymasterBalance: (b/1e18).toFixed(6)
        })
      })
      gsnStatus.getActiveRelayers().then(count => {
        setState({
          totalRelayers: count.toString()
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
      // @ts-ignore
      <table border={1}
             style={{textAlign: "left"}}>
        <tbody>
        <tr>
          <td>
            <b>GSN Contracts Status:</b><br/>
            Current network: {global.network.name}<br/>
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