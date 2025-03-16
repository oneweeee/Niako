import { Component } from "react";
import { clientId } from "../../../../../config";

import { ReactComponent as IconAddCircle } from '../../../../../assets/svg/AddCircleStroke.svg';
import { IconButton } from "../../../../../components/IconButton/IconButton";

export class AddServerButton extends Component {
    render() {
        return (
            <a href={`https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=0&redirect_uri=${window.location.href}&response_type=code&scope=bot%20applications.commands.permissions.update`} style={{left: '24px'}}>
                <IconButton icon={IconAddCircle} useBig={true} />
            </a>
        )
    }
}