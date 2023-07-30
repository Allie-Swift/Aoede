import * as ScrollArea from '@radix-ui/react-scroll-area';

export default function ({children}) {
    return (
        <ScrollArea.Root className="ScrollAreaRoot" style={{height: "100%"}}>
            <ScrollArea.Viewport className="ScrollAreaViewport" style={{height: "100%"}}>
                {children}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
                <ScrollArea.Thumb className="ScrollAreaThumb"/>
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
                <ScrollArea.Thumb className="ScrollAreaThumb"/>
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner className="ScrollAreaCorner"/>
        </ScrollArea.Root>
    )
}