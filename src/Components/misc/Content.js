import {useEffect, useState} from "react";
import {Button, List, Menu, Space} from "antd";
import ScrollArea from "../Wrapper/ScrollArea";
import * as Remix from "../Icon/Remix";

const {ipcRenderer} = window.require('electron');
export default function Content({}) {

    const [artistList, _artistList] = useState([])
    const [albumList, _albumList] = useState([])

    useEffect(() => {
        ipcRenderer.invoke("ServerAddress").then(serverAddress => {
            fetch(`${serverAddress}api/artists`)
                .then((resp) => resp.json())
                .then(data => _artistList(data.map(o => ({
                    key: o.name, label: o.name
                }))))
            fetch(`${serverAddress}api/albums`)
                .then((resp) => resp.json())
                .then(data => _albumList(data))

        })
    }, [])


    return (
        <div style={{height: '100%', display: "flex"}}>
            <div style={{width: "200px",height: "100%", display: "flex",flexDirection:"column",
                zIndex:'9',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 8px'}}>

                <Menu items={[
                    {key:"allartist",label:"All Artists"},
                    {type:'divider'}
                ]} style={{borderInlineEnd: 0,width: "200px"}}/>
                <div style={{flex: "1 0", overflow: "hidden"}}>
                    <ScrollArea>

                        <Menu items={artistList} style={{borderInlineEnd: 0,width: "200px"}}/>
                    </ScrollArea>
                </div>

            </div>


        </div>
    )
}