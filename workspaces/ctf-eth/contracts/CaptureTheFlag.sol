/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity >=0.7.6;
import "@opengsn/contracts/src/BaseRelayRecipient.sol";

contract CaptureTheFlag is BaseRelayRecipient {

    event FlagCaptured(address previousHolder, address currentHolder);

    address public currentHolder = address(0);

    function captureTheFlag() external {
        address previousHolder = currentHolder;

        currentHolder = _msgSender();

        emit FlagCaptured(previousHolder, currentHolder);
    }

    constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }

    string public override versionRecipient = "2.2.0";
}
