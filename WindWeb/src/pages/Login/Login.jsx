import { Component } from "react";
import { loginUrl } from '../../config'

class Login extends Component {
    render() {
        return (<div></div>)
    }

    componentDidMount() {
        window.location.href = loginUrl
        return
    }
}

export default Login