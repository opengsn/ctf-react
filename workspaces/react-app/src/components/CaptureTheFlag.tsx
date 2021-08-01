import React, {Component} from 'react';
import {Progress, Address, ActionButton, Log, sleep} from './utils'
import {GsnStatus} from "./GsnStatus";
import {Ctf, initCtf} from "@ctf/eth";
import {CaptchaPaymaster} from "./CaptchaPaymaster";

declare let window: { ethereum: any }

interface CtfState {
  error?: string
  current?: string
  contractAddress?: string
  account?: string
  events?: any[]

  googleCaptchaResponse?: string

  status?: string
  step?: number
  total?: number
}

export class CaptureTheFlag extends Component {

  state: CtfState = {}
  gsnProvider: any
  ctf?: Ctf
  paymasterRef = React.createRef<CaptchaPaymaster>();

  async readContractInfo() {
    //TODO: type-mismatch as "Contract" is seen as imported from different packages, even though all do
    // "import {Contract} from 'ethers'" ...
    //@ts-ignore
    const ctf = this.ctf = await initCtf(this.paymasterRef.current!.createApprovalData)

    const paymasterAddress = ctf.gsnProvider.relayClient.config.paymasterAddress!
    this.paymasterRef.current!.setInfo(paymasterAddress)
    this.gsnProvider = ctf.gsnProvider

    const [current, events, account] = await Promise.all([
      ctf.getCurrentFlagHolder(),
      ctf.getPastEvents(),
      ctf.getSigner()
    ])

    this.setState({
      contractAddress: ctf.address,
      account,
      current,
      events: this.prependEvents(undefined, events),
    })

    ctf.listenToEvents(event => {
      this.log(event)
      this.setState({
        current: event.currentHolder
      })
    }, ({event, step, total}) => {
      console.log({event, step, total})
      this.progress({event, step, total})
    })
  }

  // @ts-ignore
  progress({event, step, total, error = null}) {
    this.setState({status: event, step, total, error})
  }

  async componentDidMount() {
    await this.readContractInfo()
      .catch(e => {
        console.log('ex=', e);
        this.setState({error: e.message})
      })
  }

  componentWillUnmount() {
    this.ctf!.stopListenToEvents()
  }

  async simSend() {
    for (let i = 1; i <= 8; i++) {
      this.setState({step: i, total: 8, status: null})
      await sleep(500)
    }
    this.setState({status: 'Mining'})
    await sleep(300)
    this.setState({status: 'done'})
  }

  // add new events to the array. newer event is FIRST. keep only the first 5 lines
  // (that is, latest 5 events)
  prependEvents(currentEvents: any[] | undefined, newEvents: any[]) {
    return [...(newEvents ?? []).reverse(), ...(currentEvents ?? [])].slice(0, 5)
  }

  log(event: any) {
    this.setState({events: this.prependEvents(this.state.events, [event])})
  }

  async doCapture() {
    this.setState({status: 'sending'})
    const res = await this.ctf!.capture()
    this.setState({status: "txhash=" + res.hash.slice(0, 20) + ' waiting for mining'})
    const res2 = await res.wait()
    this.setState({total: null, step: null, status: 'Mined in block: ' + res2.blockNumber})
  }

  render() {

    // @ts-ignore
    // @ts-ignore
    return <>
      <h1>Capture The Flag - Without Paying for Gas</h1>
      Click the button to capture the flag with your account, using GSN<br/>
      The on-chain <b>Paymaster</b> contract only accepts requests with a valid CAPTCHA.<br/> Try to "cheat" (attempt to
      capture the flag withput captcha, or re-using the same captcha for multiple requests)

      <br/>
      {!this.state.account && <span> <ActionButton title="Connect to Metamask"
                                                   action={window.ethereum.enable}
                                                   onError={() => (e: Error) => this.setState({error: e ? e.message : "error"})}
      /><p/></span>}


      <CaptchaPaymaster ref={this.paymasterRef} sitekey={"6LdZ4MIbAAAAAPliyu1Y_gVA0MCiDol6mY6cnn9Y"}/>
      <ActionButton title="Click here to capture the flag"
                    enabled={!this.state.account}
                    action={() => this.doCapture()}
                    onError={(e?: Error) => {
                      console.log('==ex2', e)
                      this.setState({error: e ? e.message : null})
                    }}/>
      <br/>
      Your account:<Address addr={this.state.account}/> <br/>
      CTF Contract: <Address addr={this.state.contractAddress}/><br/>
      Current flag holder: <Address addr={this.state.current}/>
      {this.state.current && this.state.current === this.state.account && "(you!)"}
      <br/>

      {this.state.error ?
        //@ts-ignore
        <font color="red">Error: {this.state.error}</font>
        :
        <Progress step={this.state.step} total={this.state.total} status={this.state.status}/>
      }

      <div style={{textAlign: "left"}}>

        <Log events={this.state.events}/>
      </div>

      {this.ctf && <GsnStatus ctf={this.ctf}/>}
    </>
  }
}
