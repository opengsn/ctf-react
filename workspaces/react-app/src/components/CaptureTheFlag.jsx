import React from 'react';
import {initCtf} from '@ctf/eth/src/Ctf'
import {Progress, Address, ActionButton, Log, sleep} from './utils.jsx'

export class CaptureTheFlag extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  async readContractInfo() {
    const ctf = await initCtf()

    const [current, events, account] = await Promise.all([
      ctf.getCurrentFlagHolder(),
      ctf.getPastEvents(),
      ctf.getSigner()
    ])

    this.setState({
      contractAddress: ctf.address,
      account,
      current,
      events: this.prependEvents(null, events)
    })

    ctf.listenToEvents(event => {
      this.log(event)
    })

    this.ctf = ctf
  }


  componentDidMount() {
    this.readContractInfo().catch(e => {
      console.log('ex=', e);
      this.setState({error: e.message})
    })
  }

  componentWillUnmount() {
    this.ctf.stopListenToEvents()
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
  prependEvents(currentEvents, newEvents) {
    return [...newEvents.reverse(), ...(currentEvents || [])].slice(0, 5)
  }

  log(event) {
    this.setState({events: this.prependEvents(this.state.events, [event])})
  }

  async doCapture() {
    this.setState({status: 'sending'})
    const res = await this.ctf.capture()
    this.setState({status: "tx=" + res.hash.slice(0,20)})
    const res2 = await res.wait()
    this.setState({total:null, step:null,status: 'Mined in block: ' + res2.blockNumber})
  }

  render() {

    return <>
      <h1>Capture The Flag </h1>
      Click the button to capture the flag with your account.
      {/*<ActionButton title="Connect Wallet" action={() => window.ethereum.enable()}/>*/}
      <br/>
      <ActionButton title="Click here to capture the flag"
                    action={() => this.doCapture()}
                    onError={(e) => {
                      console.log('==ex2',e)
                      this.setState({error: e ? e.message : null})
                    }}/>
      <br/>
      Your account:<Address addr={this.state.account}/> <br/>
      CTF Contract: <Address addr={this.state.contractAddress}/><br/>
      Current flag holder: <Address addr={this.state.current}/>
      {this.state.current === this.state.account && "(you!)"}
      <br/>

      {this.state.error ?
        <font color="red">Error: {this.state.error}</font>
        :
        <Progress step={this.state.step} total={this.state.total} status={this.state.status}/>
      }

      <Log events={this.state.events}/>
    </>
  }
}
