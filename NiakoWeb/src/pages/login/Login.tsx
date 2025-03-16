import { Component } from "react";
import { loginUrl } from '../../config'

export class Login extends Component {
    render() {
        return (<div></div>)
    }

    componentDidMount() {
        return window.location.href = loginUrl
    }
}