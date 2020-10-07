/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.6.8;
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";

contract CaptureTheFlag is BaseRelayRecipient {

    event FlagCaptured(address previousHolder, address currentHolder);

    address public currentHolder = address(0);

    function captureTheFlag() external {
        address previousHolder = currentHolder;

        currentHolder = _msgSender();

        emit FlagCaptured(previousHolder, currentHolder);
    }

    function setTrustedForwarder(address forwarder) public {
        trustedForwarder = forwarder;
    }

    string public override versionRecipient = "2.0.0";
}
