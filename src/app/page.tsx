import ChatContainer from "@/components/ChatContainer";
import ChatList from "@/components/ChatList";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="grid grid-cols-4 grid-rows-12 h-screen p-4 gap-4 bg-background-second">
      <Header />
      <ChatList />
      <ChatContainer />
    </div>
  );
}
