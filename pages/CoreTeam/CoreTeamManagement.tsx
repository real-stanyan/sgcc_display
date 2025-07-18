import { useState, useEffect, useContext } from "react";
// import { CoreTeamEditIDContext } from "../../src/context/CoreTeamEditIDContext";
import { SectionContext } from "../../src/context/SectionContext";
import { Input } from "../../src/components/ui/input";
import { motion } from "framer-motion";
import { Pencil, Trash, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../src/components/ui/alert-dialog";

type CoreTeam = {
  id: string;
  i: number;
  danwei: string;
  bumen: string;
  banzu_name: string;
  banzu_type: string;
  yewu_percent: string;
  bili: string | null;
  jiafenxiang: string | null;
};

const CoreTeamManagement = () => {
  // const [, setSection] = useContext(SectionContext);
  // const [, setEditID] = useContext(CoreTeamEditIDContext);
  const [data, setData] = useState<CoreTeam[]>([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/returnAllBanzu")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const filtered = data.filter((item) => {
    const kw = keyword.toLowerCase();
    return Object.values(item).some(
      (v) => v && typeof v === "string" && v.toLowerCase().includes(kw)
    );
  });

  const deleteByID = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/deleteCoreTeamByID/${id}`, {
        method: "DELETE",
      });
      const res = await fetch("http://localhost:3000/api/returnAllCoreTeam");
      setData(await res.json());
      toast.success("删除成功");
    } catch {
      toast.error("删除失败");
    }
  };

  const swapOrder = (i: number, dir: -1 | 1) => async () => {
    try {
      const url =
        dir < 0
          ? `http://localhost:3000/api/increaseCoreTeamOrderByI/${i}`
          : `http://localhost:3000/api/decreaseCoreTeamOrderByI/${i}`;
      await fetch(url, { method: "POST" });
      setData((prev) =>
        prev
          .map((it) =>
            it.i === i
              ? { ...it, i: i + dir }
              : it.i === i + dir
              ? { ...it, i }
              : it
          )
          .sort((a, b) => a.i - b.i)
      );
      toast.success("排序更新");
    } catch {
      toast.error("排序失败");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex justify-between items-center h-24 px-8">
        <h1 className="text-2xl font-semibold">Core Team Management</h1>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="搜索..."
            className="border h-10"
            onChange={(e) => setKeyword(e.target.value.trim())}
          />
          <div
            className="px-4 bg-gray-900 text-gray-300 h-10 flex items-center cursor-pointer"
            // onClick={() => setSection("coreTeam_AddData")}
          >
            添加
          </div>
        </div>
      </div>
      <div className="text-right px-8 pb-2">共 {filtered.length} 条</div>
      <div className="px-8 space-y-2">
        {filtered.length ? (
          filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              className="flex bg-gray-200 rounded"
            >
              <div className="w-1/10 flex flex-col items-center p-2">
                <ChevronUp
                  size={24}
                  className={`${idx === 0 ? "invisible" : ""} cursor-pointer"`}
                  onClick={swapOrder(item.i, -1)}
                />
                <span className="font-bold">{item.i}</span>
                <ChevronDown
                  size={24}
                  className={`${
                    idx === data.length - 1 ? "invisible" : ""
                  } cursor-pointer"`}
                  onClick={swapOrder(item.i, 1)}
                />
              </div>
              <div className="flex-1 p-4">
                <div>
                  <strong>ID:</strong> {item.id}
                </div>
                <div>
                  <strong>单位:</strong> {item.danwei}
                </div>
                <div>
                  <strong>部门:</strong> {item.bumen}
                </div>
                <div>
                  <strong>班组名称:</strong> {item.banzu_name}
                </div>
                <div>
                  <strong>班组类型:</strong> {item.banzu_type}
                </div>
                <div>
                  <strong>覆盖率:</strong> {item.yewu_percent}
                </div>
                <div>
                  <strong>自主比例:</strong> {item.bili || "—"}
                </div>
                <div>
                  <strong>加分项:</strong> {item.jiafenxiang || "—"}
                </div>
              </div>
              <div className="w-1/6 flex flex-col">
                <div
                  className="flex-1 flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => {
                    // setEditID(item.id);
                    // setSection("coreTeam_EditData");
                  }}
                >
                  <Pencil size={20} />
                  编辑
                </div>
                <AlertDialog>
                  <AlertDialogTrigger className="flex-1">
                    <div className="flex flex-col items-center justify-center cursor-pointer">
                      <Trash size={20} />
                      删除
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除？</AlertDialogTitle>
                      <AlertDialogDescription>
                        此操作不可撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600"
                        onClick={() => deleteByID(item.id)}
                      >
                        确认
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-64 flex items-center justify-center text-xl">
            无数据
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreTeamManagement;
