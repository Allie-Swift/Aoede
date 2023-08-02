import {Button, Input, Menu, Space} from "antd";
import ScrollArea from "../Wrapper/ScrollArea";
import {useState} from "react";
import * as Remix from "../Icon/Remix"

function Navigator({currentOption}) {

    const [menuItems, _menuItems] = useState([
        {
            type: "divider"
        },
        {key: "M1", label: "Library", icon: <Remix.Music2/>},
        {key: "M2", label: "Favourite", icon: <Remix.Heart/>},
        {
            type: "divider"
        }
    ])

    const [playlistItems, _playlistItems] = useState([
        {key: "P1", label: "Anime BGM", icon: <Remix.Playlist/>},
        {key: "P2", label: "Classic", icon: <Remix.Playlist/>},
        {key: "P3", label: "Taylor Swift", icon: <Remix.Playlist/>},

    ])

    return (
        <div style={{height: "100%", display: "flex",flexDirection:"column"}}>
            <div style={{ display: "flex", flexDirection: "row",justifyContent:"space-between",padding:'5px 10px',height:'47px'}}>
                <Space style={{paddingLeft:'10px'}}>
                    Aoede
                </Space>
                <Space direction={"horizontal"} size={0}>
                    <Button shape={"circle"}  type={"text"} icon={<Remix.PlaylistAdd/>}/>
                    <Button shape={"circle"}  type={"text"} icon={<Remix.Settings/>}/>
                </Space>
            </div>

            <Menu items={menuItems} style={{borderInlineEnd: 0}}/>
            <div style={{flex: "1 0", overflow: "hidden"}}>
                <ScrollArea>

                    <Menu items={playlistItems} style={{borderInlineEnd: 0}}/>
                </ScrollArea>
            </div>

        </div>


    )

}


export default Navigator