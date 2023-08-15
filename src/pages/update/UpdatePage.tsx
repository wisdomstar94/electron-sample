import { Link, Outlet } from "react-router-dom";

export function UpdatePage() {
  return (
    <>
      업데이트 페이지 입니다.
      <div>
        <Link to="test">하위 test 페이지로..</Link>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}