import {Breadcrumb, Button, Slider, Space} from "antd";
import * as Remix from "../Icon/Remix"

export default function () {
    return (
        <div style={{
            position: "relative",
            width: "100%",
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <div style={{position: "absolute", width: "100%", top: '-5px'}}>
                <Slider style={{margin: '0'}} tooltip={{formatter: null}}/>
            </div>
            <Space size={0} style={{width: "200px", paddingLeft: "10px", justifyContent: "flex-start"}}>
                <Button size={"small"} shape={"circle"} type={'link'} icon={<Remix.Disc/>}/>
                <Button size={"small"} shape={"circle"} type={'link'} icon={<Remix.Album/>}/>
                <Button size={"small"} shape={"circle"} type={'link'} icon={<Remix.User/>}/>
            </Space>
            <Space>
                <Button size={"small"} shape={"circle"} icon={<Remix.Shuffle/>} type={"text"}/>
                <Button size={"middle"} shape={"circle"} icon={<Remix.SkipBack/>}/>
                <Button size={"large"} shape={"circle"} icon={<Remix.Play/>}/>
                <Button size={"middle"} shape={"circle"} icon={<Remix.SkipForward/>}/>
                <Button size={"small"} shape={"circle"} icon={<Remix.RepeatOne/>} type={"text"}/>
            </Space>
            <Space size={0} style={{width: "200px", paddingRight: "10px", justifyContent: "flex-end"}}>
                <Breadcrumb style={{marginRight: "20px"}}>
                    <Breadcrumb.Item>0:00</Breadcrumb.Item>
                    <Breadcrumb.Item>0:00</Breadcrumb.Item>
                </Breadcrumb>
                <Button size={"small"} shape={"circle"} type={'text'} icon={<Remix.SpeedUp/>}/>
                <Button size={"small"} shape={"circle"} type={'text'} icon={<Remix.VolumnUp/>}/>
            </Space>

        </div>
    )
}