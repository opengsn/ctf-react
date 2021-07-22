// @ts-ignore
import React from 'react'

// @ts-ignore
export const CtfInfo = () => <><p/><table border="1" style={{fontSize:-5, textAlign: "left"}}><tbody><tr><td>
	<h2>How does it work ?</h2>
    In simple demonstration, you can click the button to "capture the flag".<br/>
    All transactions go through GSN - you are only asked to sign, and not to pay for the transactions<br/>
    You can click the CTF contract link, and see that it indeed has its state changed and emitted events - but only through internal transactions.
    The actual transaction is always on the RelayHub<p/>
    The paymaster that pays for the transaction is also not called directly, but as internal transaction from the same RelayHub transaction.
    <p/>
    NOTE: if the paymaster's balance is too low, you can send some test eth to it, to "top it up". <p/>
    For the purpose of this demo, the paymaster is very naive paymaster, and will accept to pay for any request.
</td></tr></tbody></table>    
</>


