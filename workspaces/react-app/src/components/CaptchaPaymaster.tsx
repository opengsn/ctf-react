import React, {Component} from "react";
import ReCAPTCHA, {ReCAPTCHAProps} from "react-google-recaptcha";
import {RelayRequest} from "@opengsn/common/dist/EIP712/RelayRequest";
import axios from "axios";
import {Contract} from "ethers";
import {AsyncDataCallback} from "@opengsn/common/dist/types/Aliases";


const DEFAULT_URL = 'https://captcha-service.netlify.app/validate-captcha';

interface CaptchaProps extends ReCAPTCHAProps {
  serviceUrl?: string
  paymasterAddress?: string
}

interface CaptchaState {
  captchaResponse?: string
  serviceUrl?: string
  paymasterAddress?: string
}

export class CaptchaPaymaster extends Component<CaptchaProps, CaptchaState> {

  constructor(props: CaptchaProps) {
    super(props);
    this.state = {serviceUrl: props.serviceUrl}
    this.createApprovalData = this.createApprovalData.bind(this)
    this.setInfo = this.setInfo.bind(this)
    this.handleCaptcha = this.handleCaptcha.bind(this)
  }

  setInfo(paymasterAddress: string, url?: string) {
    this.setState({
      paymasterAddress,
      serviceUrl: url ?? this.state.serviceUrl
    })
  }

  handleCaptcha(captchaResponse: string | null) {
    this.setState({captchaResponse: captchaResponse ?? 'no-response'})
  }

  async createApprovalData(verifyingPaymaster?: Contract): Promise<AsyncDataCallback> {

    let pmSigner: string | null = null

    if (verifyingPaymaster != null) {
      //for santify check:read the current signer contract
      pmSigner = await verifyingPaymaster.functions.signer()
        .catch(e => {
          throw new Error(`'Not a VerifyingPaymaster: ${verifyingPaymaster.address}: ${e.message}`)
        })
    }

    return async (req: RelayRequest) => {
      try {

        let captchaServiceUrl = this.state.serviceUrl || DEFAULT_URL
        // captchaServiceUrl = 'http://localhost:8888/validate-captcha'
        const response = await axios.post(captchaServiceUrl, {
          gresponse: this.state.captchaResponse,
          userdata: req
        })

        const json = await response.data
        if (!json.success) {
          throw new Error('service failed:' + JSON.stringify(json))
        }

        if (pmSigner != null && json.address.toLowerCase() != pmSigner.toString().toLowerCase()) {
          throw new Error('wrong verification signer. contract.signer=' + pmSigner + ' service response signer=' + json.address)
        }

        return json.approvalData
      } catch (e) {
        console.log('===ex', e)
        throw e
      }

    };
  }

  render() {
    return <ReCAPTCHA {...this.props} sitekey={this.props.sitekey} onChange={this.handleCaptcha}/>
  }
}

