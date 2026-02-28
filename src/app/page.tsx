
import AuthCheck from "@/components/auth/AuthCheck";
import { ChatInfoPanel } from "@/components/chat/ChatInfoPanel";
import ChatContainer from "@/components/ChatContainer";
import ChatList from "@/components/ChatList";
import Header from "@/components/Header";
import ListenersProvider from "@/components/ListenersProvider";
import MobileChatSelect from "@/components/Mobile/MobileChatSelect";

export default function Home() {

  return (
    <AuthCheck>
      <div className="flex h-dvh flex-col bg-background">
        <Header />
        <div className="flex min-h-0 flex-1">
          <ListenersProvider />
          <MobileChatSelect />
          <ChatList />
          <ChatContainer />
          <ChatInfoPanel />
        </div>
      </div>
    </AuthCheck>
  );
}
