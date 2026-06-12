import { Link } from "react-router-dom";
import { Home, Compass } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-lg animate-[fade-in-up_0.5s_ease-out]">
        <div className="relative inline-block mb-8">
          <h1 className="font-serif text-[120px] md:text-[160px] font-bold leading-none bg-gradient-to-br from-primary-400 via-primary-600 to-success-500 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-warning-400/30 blur-2xl" />
          <div className="absolute -bottom-4 -left-8 w-28 h-28 rounded-full bg-primary-400/20 blur-3xl" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-neutral-800 mb-3 tracking-tight">
          哎呀，页面走丢了
        </h2>
        <p className="text-neutral-500 leading-relaxed mb-8 text-balance">
          你访问的页面不存在或已被移除。
          别担心，让我们带你回到正轨，继续寻找理想的内推机会吧。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button size="lg" leftIcon={<Home size={18} />}>
              返回首页
            </Button>
          </Link>
          <Link to="/opportunities">
            <Button
              size="lg"
              variant="secondary"
              leftIcon={<Compass size={18} />}
            >
              浏览机会广场
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
