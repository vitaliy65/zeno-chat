
import AuthCheck from "@/components/auth/AuthCheck";
import ChatContainer from "@/components/ChatContainer";
import ChatList from "@/components/ChatList";
import Header from "@/components/Header";
import ListenersProvider from "@/components/ListenersProvider";
import MobileChatSelect from "@/components/Mobile/MobileChatSelect";

export default function Home() {

  return (
    <AuthCheck>
      <div className="grid grid-cols-[96px_1fr_1fr_1fr] lg:grid-cols-[356px_1fr_1fr_1fr] grid-rows-12 h-screen p-4 gap-4 bg-background-second overflow-hidden">
        <ListenersProvider />
        <Header />
        <MobileChatSelect />
        <ChatList />
        <ChatContainer />
      </div>
    </AuthCheck>
  );
}
