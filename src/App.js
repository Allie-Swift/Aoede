import './App.css';
import {Button, Layout} from "antd";
import Navigator from "./Components/misc/Navigator";
import Player from "./Components/misc/Player";
import {useEffect, useState} from "react";
import Content from "./Components/misc/Content";
const { ipcRenderer } = window.require('electron');

function App() {

    const [serverAddress,_serverAddress] =useState("")

    const upd = ()=>{
        ipcRenderer.invoke("ServerAddress").then(r => _serverAddress(r))
    }

    useEffect(()=>{
        ipcRenderer.invoke("ServerAddress").then(r => _serverAddress(r))
    },[])

    return (
        <Layout className={"App"}>
            <Layout  style={{flex: '1 0'}}>
                <Layout.Sider theme={"light"}  width={250} style={{
                    zIndex:'10',
                    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 8px'
                }}>
                    <Navigator/>
                </Layout.Sider>
                <Layout.Content style={{background:"white"}}>
                    <Content serverAddress={serverAddress}/>
                </Layout.Content>
            </Layout>
            <Layout.Footer style={{height:"70px",padding:'0',background:"white",zIndex:'11'}}>
                <Player/>
            </Layout.Footer>
        </Layout>
    );
}

export default App;
