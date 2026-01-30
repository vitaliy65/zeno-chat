import React from "react";
import ChatBoxMsgGetter from "./ChatBoxMsgGetter";
import ChatBoxMsgSender from "./ChatBoxMsgSender";

export default function ChatBox() {
    const arrayMsg = React.useMemo(
        // eslint-disable-next-line react-hooks/purity
        () => Array.from({ length: 14 }, () => Math.random() >= 0.5),
        []
    );

    return (
        <div className='flex flex-col w-full h-full rounded-md shadow-custom-lg-inset px-4 py-2 overflow-x-hidden overflow-y-auto space-y-1'>
            {arrayMsg.map((isSender, index, self) => {
                let IsNextMsgSameType = false;

                if (index + 1 < self.length) {
                    IsNextMsgSameType = self[index + 1] == self[index]
                }

                return (
                    isSender ?
                        <ChatBoxMsgSender key={index} nextSameType={IsNextMsgSameType} /> :
                        <ChatBoxMsgGetter key={index} nextSameType={IsNextMsgSameType} />
                )
            })}
        </div>
    )
}
