import {useEffect, useState} from "react";
import {Image, Menu, Typography} from "antd";
import ScrollArea from "../Wrapper/ScrollArea";
import * as Remix from "../Icon/Remix";
import "./Album.css"

const {ipcRenderer} = window.require('electron');
export default function Content({}) {

    const [artistList, _artistList] = useState([])
    const [albumList, _albumList] = useState([])
    const [serverAddress, _serverAddress] = useState("")
    const [currentArtist, _currentArtist] = useState("ALLARTISTS")

    useEffect(() => {
        ipcRenderer.invoke("ServerAddress").then(serverAddress => {
            _serverAddress(serverAddress)
            fetch(`${serverAddress}api/artists`)
                .then((resp) => resp.json())
                .then(data => _artistList(data.map(o => ({
                    key: o.name, label: o.name, icon: <Remix.User/>
                }))))
            fetch(`${serverAddress}api/albums`)
                .then((resp) => resp.json())
                .then(data => _albumList(data))

        })
    }, [])

    const onArtistSelect = ({key}) => {
        _currentArtist(key)
    }

    const contributedBy = (album, artistName) => {
        if (artistName === "ALLARTISTS") return true
        return album.artists.some((artist) => artist.name === artistName)
    }

    console.log(albumList)
    return (
        <div style={{height: '100%', display: "flex"}}>
            <div style={{
                width: "200px", height: "100%", display: "flex", flexDirection: "column",
                zIndex: '9',
                boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 8px'
            }}>

                <Menu selectedKeys={[currentArtist]} items={[
                    {key: "ALLARTISTS", label: "All Artists"},
                    {type: 'divider'}
                ]} style={{borderInlineEnd: 0, width: "200px"}} onSelect={onArtistSelect}/>
                <div style={{flex: "1 0", overflow: "hidden"}}>
                    <ScrollArea>
                        <Menu items={artistList} selectedKeys={[currentArtist]} onSelect={onArtistSelect}
                              style={{borderInlineEnd: 0, width: "200px"}}/>
                    </ScrollArea>
                </div>

            </div>
            <div style={{
                height: "100%", display: "flex", zIndex: '8'
            }}>
                <ScrollArea>
                    <div style={{
                        height: "100%", display: "flex",
                        flexDirection: "row", flexWrap: "wrap", gap: "15px",
                        padding: "20px"
                    }}>
                        {
                            albumList.filter((album) => contributedBy(album, currentArtist)).map(album => (
                                <div className={"Album"} style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: 'center',
                                    border: "1px solid silver",
                                    borderRadius: "1em",
                                    padding: "5px",


                                }}>
                                    <div className={"AlbumCover"}>
                                        <Image width={150} height={150}
                                               src={`${serverAddress}api/albumCover/${album.name}`}
                                               preview={false}
                                        />
                                    </div>

                                    <Typography.Text
                                        style={{
                                            textAlign: 'center',
                                            width: "120px",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            overflow: "hidden"
                                        }}
                                    >{album.name}</Typography.Text>

                                </div>
                            ))
                        }
                    </div>
                </ScrollArea>

            </div>


        </div>
    )
}