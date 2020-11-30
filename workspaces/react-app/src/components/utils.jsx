import React, {useState} from 'react';

// Utility components

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const Elipsis = '\u2026'


/** progress bar with title
 * show progress of "step" out of "total" (if both exist)
 * show title (if exists)
 */
export function Progress({status, step, total}) {
  return <pre>
      {total && ('['.padEnd(step, '=') + '>').padEnd(total + 1) + '] '}
    {status && status}
   </pre>
}

/**
 * network address. shortened to prefix..suffix .
 * if "network" is provided and contains "etherscan" url prefix, then make the address a link
 */
export function Address({addr, network = window.network}) {
  return <a href={network && network.etherscan && network.etherscan + addr} target="etherscan">
    <span style={{"fontFamily": "monospace"}}>
      {("" + addr).replace(/^(.{6})(?:.*)(.{4})$/, `$1${Elipsis}$2`)}
    </span></a>
}

/**
 * a button with async action function
 * button is disabled while async function is active, and re-enabled when it completes
 */
export function ActionButton({title, action, enabled=true, onError}) {

  const [disabled, setDisabled] = useState(!enabled)

  const onClick = () => {
    onError && onError(null);
    setDisabled(true);
    action()
      .catch(err => onError && onError(err))
      .finally(() => setDisabled(false))
  }

  return <button
    disabled={disabled}
    onClick={onClick}>
    {title}
  </button>
}

export function LogEvent({cur, prev}) {
  return <div> Captured the flag from <Address addr={prev}/> by <Address addr={cur}/></div>
}

/**
 * return a list of events to display (showing only the first "last" entries.)
 * note that the list is assumed to be sorted in reverse order
 */
export function Log({events, last = 5}) {
  return <ul>
    {events && events.slice(0, last).map((e, key) =>
      <li key={key}><LogEvent cur={e.currentHolder} prev={e.previousHolder}/></li>
    )}
  </ul>
}
