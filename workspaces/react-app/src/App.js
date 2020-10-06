import React, {useState} from 'react';
import './App.css';
import CtfArtifact from '@ctf/eth/artifacts/CaptureTheFlag.json'
import ethers from 'ethers'
// import { asd } from '@ctf/eth';


var theContract


async function getCurrentFlagHolder() {
  return await theContract.currentHolder()
}


function listenToEvents(capturedEvent) {
    theContract.on('FlagCaptured', (previousHolder, currentHolder, rawEvent) => {
      capturedEvent( {previousHolder, currentHolder} );
    })
}

async function backEvents(count=5) {
  const logs = await theContract.queryFilter('FlagCaptured', 1)
  return logs.map( e=>({previousHolder:e.args.previousHolder, currentHolder: e.args.currentHolder}) )
}


window.ethereum.autoRefreshOnNetworkChange=false
//progress bar with title
//show progress of "step" out of "total" (if both exist) 
// show title (if exists)
function Progress({status,step,total}) {
  const width = total
  return <pre> 
      { total && ('['.padEnd(step,'=')+'>').padEnd(width+1)+'] ' }
      { status && status }
   </pre>
}

async function sleep(ms) {
  return new Promise(resolve=>setTimeout(resolve,ms))
}

const Elipsis = '\u2026'
let Address = ({addr,network} ) => <a href={network && network.etherscan+addr} target="etherscan" >
      <font face="monospace">
        {(""+addr).replace( /^(.{6})(?:.*)(.{4})$/, `$1${Elipsis}$2` )}
      </font></a>


// button with async function
// button is disabled until async function completes
function ActionButton({title, action, onError}) {

  const [ disabled, setDisabled] = useState(false)

  const onClick = ()=> {
    onError && onError(null);
    setDisabled(true);
    action()
      .catch(err=>onError && onError(err))
      .finally(()=>setDisabled(false))
  }

  return <button 
              disabled={disabled}
              onClick={onClick}>
            {title}
          </button>
}

const LogEvent = ({cur, prev}) => <div> Captured the flag from <Address addr={prev}/> by <Address addr={cur}/> </div>
function Log({events, last=5}) {
  return <ul>
            {events && events.slice(0,last).map((e,key)=> 
                <li key={key}><LogEvent cur={e.currentHolder} prev={e.previousHolder} /></li>  
            )}
          </ul>
}

class CaptureTheFlag extends React.Component {

  constructor(props) {
    super(props)
    this.state={}
  }

  async readContractInfo() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const net = await provider.getNetwork()
    const networks = {
      42:'0x22d1300304Ea3B658f0a6e925dd62bcfcDd91ce4'
    }
    console.log( 'net=', net)
    const addr = networks[net.chainId] || require( '@ctf/eth/deployments/localhost/CaptureTheFlag.json' ).address
    //kovan
    const signer = provider.getSigner()
    theContract = new ethers.Contract(addr, CtfArtifact.abi, signer)

    const [ current, events, account ] = await Promise.all([
        getCurrentFlagHolder(),
        backEvents(),
        signer.getAddress()
      ])
    this.setState( {
        contractAddress: theContract.address,
        account,
        current,
        events : this.prependEvents(null,events)
      })

    listenToEvents(event=>{
      this.log(event)
    })
  }


  componentDidMount() {
    this.readContractInfo()
  }

  componentWillUnmount() {

  }

  async simSend() {
    for ( let i=1; i<=8; i++ ) {
      this.setState({step:i, total:8, status:null})
      await sleep(500)
    }
    this.setState({status:'Mining'})
    await sleep(300)
    this.setState({status: 'done'})
  }

  // add new events to the array. newer event is FIRST. keep only the first 5 lines
  // (that is, latest 5 events)
  prependEvents( currentEvents, newEvents ) {
    return [ ...newEvents.reverse(), ...(currentEvents||[]) ].slice(0,5)
  }

  log(event) {
    this.setState({ events: this.prependEvents(this.state.events, [event]) })
  }

  async doCapture() {
    this.setState({status: 'sending'})
    const res = await theContract.captureTheFlag()
    this.setState({ status: "tx="+res.hash.slice(0,10) })
    const res2 = await res.wait()
    this.setState({status: 'Mined in: '+res2.blockNumber})
  }

  render() {

    return <>
        <h1>Capture The Flag </h1>
        Click the button to capture the flag with your account.
        <ActionButton title="Connect Wallet" action={ ()=>window.ethereum.enable() } />
        <ActionButton title="Click here to capture the flag"
            action={ ()=>this.doCapture()}
            onError={(e)=>this.setState({error:e?e.message:null})} />

        Your account:<Address addr={this.state.account} /> <br/>
        Current flag holder: <Address addr={this.state.current} /> 
        { this.state.current === this.state.account && "(you!)"}
        <br/>

        <Progress step={this.state.step} total={this.state.total} status={this.state.status} />
        { this.state.error && <font color="red">Error: {this.state.error}</font>}

        <Log events={this.state.events} />
    </>
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CaptureTheFlag/>
      </header>
    </div>
  );
}

export default App;
