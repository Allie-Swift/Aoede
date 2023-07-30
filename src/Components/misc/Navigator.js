import {Menu} from "antd";
import ScrollArea from "../Wrapper/ScrollArea";
import {useState} from "react";

function Navigator(){

    const [menuItems,_menuItems]=useState([
        {key:"M1",label:"Search"},
        {key:"M2",label:"All Music"},
        {
            type:"divider"
        }
    ])

    return (
        <ScrollArea>
            <Menu items={menuItems} style={{borderInlineEnd: 0}}/>
        </ScrollArea>

    )

}


export default Navigator