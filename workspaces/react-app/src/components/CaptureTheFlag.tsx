import React, { Component, useEffect, useState } from 'react'
import { Progress, Address, ActionButton, Log, sleep } from './utils'
import { GsnStatus } from './GsnStatus'
import { Ctf, initCtf, getSupportedPaymasters } from '@ctf/eth'
import { Web3Provider } from '@ethersproject/providers'
import { NetSwitcher } from './NetSwitcher'

import Form from 'react-bootstrap/Form'
import { PaymasterDetails } from '@ctf/eth/dist/config/networks'

declare let window: { ethereum: any }

interface CtfState {
  error?: string
  current?: string
  contractAddress?: string
  account?: string
  events?: any[]

  status?: string
  step?: number
  total?: number
  supportedPaymasters?: PaymasterDetails[]
  paymasterDetails?: PaymasterDetails
}

// TODO: define types
export function usePaymasterVersion ({
  paymasterDetails,
  ctf
}: { paymasterDetails: PaymasterDetails, ctf?: Ctf }): any {
  const [paymasterVersion, setPaymasterVersion] = useState<string>()

  useEffect(() => {
    ctf?.getPaymasterVersion(paymasterDetails.address!)
      .then((version: string) => {
        setPaymasterVersion(
          version
        )
      })
  }, [paymasterDetails, ctf])

  return { paymasterVersion }
}

const PaymasterSelectOption = ({ paymasterDetails, ctf }: { paymasterDetails: PaymasterDetails, ctf?: Ctf }) => {
  const { paymasterVersion } = usePaymasterVersion({ paymasterDetails, ctf })
  const shortPaymasterAddress = `(${paymasterDetails.address!.substring(0, 6)}...${paymasterDetails.address!.substring(39)})`

  return <option value={paymasterDetails.address!}>
    {shortPaymasterAddress}:{paymasterDetails.name!}@{paymasterVersion}
  </option>
}

export class CaptureTheFlag extends Component {

  state: CtfState = {}
  gsnProvider: any
  ctf?: Ctf

  async switchPaymaster (e?: any): Promise<void> {
    console.log('switchPaymaster', e)

    await this.readContractInfo(e?.target?.value)
      .catch(e => {
        console.log('ex=', e)
        this.setState({ error: e.message })
      })
  }

  async readContractInfo (paymasterAddress?: string) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.supportedPaymasters = await getSupportedPaymasters()
    if (paymasterAddress == null) {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.paymasterDetails = this.state.supportedPaymasters![0]
    } else {
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.paymasterDetails = this.state.supportedPaymasters.find(it => it.address === paymasterAddress)!
    }
    const ctf = this.ctf = await initCtf(this.state.paymasterDetails)

    this.gsnProvider = ctf.gsnProvider
    if (await (ctf.ethersProvider as Web3Provider).listAccounts().then(arr => arr.length) === 0) {
      throw new Error('Connect metamask first')
    }
    const [current, account] = await Promise.all([
      ctf.getCurrentFlagHolder(),
      ctf.getSigner()
    ])

    this.setState({
      contractAddress: ctf.address,
      account,
      current,
    })
    ctf.getPastEvents().then(events => {
      this.setState({
        events: this.prependEvents(undefined, events),
      })
    })

    ctf.listenToEvents(event => {
      this.log(event)
      this.setState({
        current: event.currentHolder
      })
    }, ({ event, step, total }) => {
      console.log({ event, step, total })
      this.progress({ event, step, total })
    })
  }

  // @ts-ignore
  progress ({ event, step, total, error = null }) {
    this.setState({ status: event, step, total, error })
  }

  async componentDidMount () {
    return await this.switchPaymaster()
  }

  componentWillUnmount () {
    this.ctf!.stopListenToEvents()
  }

  async simSend () {
    for (let i = 1; i <= 8; i++) {
      this.setState({ step: i, total: 8, status: null })
      await sleep(500)
    }
    this.setState({ status: 'Mining' })
    await sleep(300)
    this.setState({ status: 'done' })
  }

  // add new events to the array. newer event is FIRST. keep only the first 5 lines
  // (that is, latest 5 events)
  prependEvents (currentEvents: any[] | undefined, newEvents: any[]) {
    return [...(newEvents ?? []).reverse(), ...(currentEvents ?? [])].slice(0, 5)
  }

  log (event: any) {
    this.setState({ events: this.prependEvents(this.state.events, [event]) })
  }

  async doCapture () {
    this.setState({ status: 'sending' })
    const res = await this.ctf!.capture()
    this.setState({ status: 'txhash=' + res.hash.slice(0, 20) + ' waiting for mining' })
    const res2 = await res.wait()
    console.log('mined!')
    this.setState({ total: null, step: null, status: 'Mined in block: ' + res2.blockNumber })
  }

  render () {

    // @ts-ignore
    // @ts-ignore
    return <>
      <h1>Capture The Flag - Without Paying for Gas</h1>
      Click the button to capture the flag with your account, using GSN 3.0.0 (beta)
      <br/>
      {!this.state.account && <span> <ActionButton title="Connect to Metamask"
                                                   action={window.ethereum.enable}
                                                   onError={() => (e: Error) => this.setState({ error: e ? e.message : 'error' })}
      /><p/></span>}

      <br/>
      <br/>
      <Form.Select
        id="paymaster"
        name="paymaster"
        onChange={this.switchPaymaster.bind(this)}
        // value={this.ctf?.paymasterDetails.name}
      >
        {this.state.supportedPaymasters?.map((details) => {
          console.log('this.state.supportedPaymasters?.map', details)
          return <PaymasterSelectOption key={details.name ?? details.paymasterType} paymasterDetails={details} ctf={this.ctf}/>
        })}
      </Form.Select>

      <br/>
      <br/>
      <ActionButton title="Click here to capture the flag"
                    enabled={!this.state.account}
                    action={() => this.doCapture()}
                    onError={(e?: Error) => {
                      console.log('==ex2', e)
                      this.setState({ error: e ? e.message : null })
                    }}/>
      <br/>
      Your account:<Address addr={this.state.account}/> <br/>
      CTF Contract: <Address addr={this.state.contractAddress}/><br/>
      Current flag holder: <Address addr={this.state.current}/>
      {this.state.current && this.state.current === this.state.account && '(you!)'}
      <br/>

      {this.state.error ?
        //@ts-ignore
        <font color="red">Error: {this.state.error}</font>
        :
        <Progress step={this.state.step} total={this.state.total} status={this.state.status}/>
      }

      <div style={{ textAlign: 'left' }}>

        <Log events={this.state.events}/>
      </div>

      {this.ctf && <GsnStatus ctf={this.ctf} key={this.state.paymasterDetails?.address}/>}
      <NetSwitcher currentChainId={this.ctf?.chainId}/>
    </>
  }
}
