import React, {useState} from 'react';
import './App.css';


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
function ActionButton({title, action}) {
  const [ disabled, setDisabled] = useState(false)
  return <button 
              disabled={disabled}
              onClick={()=>{setDisabled(true); action().finally(()=>setDisabled(false)) }}>
            {title}
          </button>
}

function Log({events, last=5}) {
  return <ul>
            {events && events.slice(0,last).map((e,key)=> 
                <li key={key}>{e}</li>  
            )}
          </ul>
}

class CaptureTheFlag extends React.Component {

  constructor(props) {
    super(props)
    this.state={}
  }

  async simSend() {
    this.setState({disabled:true})
    for ( let i=1; i<=8; i++ ) {
      this.setState({step:i, total:8, status:null})
      await sleep(500)
    }
    this.setState({status:'Mining'})
    await sleep(300)
    this.setState({status: 'done', disabled:false})
  }

  log(event) {
    this.setState({events: [event, ...(this.state.events|[]) ]})
  }

  render() {
    return <>
        <h1>Capture The Flag </h1>
        Click the button to capture the flag with your account.
        <ActionButton title="Connect Wallet" action={ ()=>window.ethereum.enable() } />
        <ActionButton title="Click here to capture the flag" action={ ()=>this.simSend()} />

        Your account:<Address addr={this.state.account} /> <br/>
        Current flag holder: <Address addr={this.state.current} /> <br/>

        <Progress step={this.state.step} total={this.state.total}  status={this.state.status} />

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
