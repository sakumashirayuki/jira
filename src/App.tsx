import "./App.css";
import { useAuth } from "context/auth-context";
import { ErrorBoundary } from "components/error-boundary";
import { FullPageErrorFallback, FullPageLoading } from "components/lib";
import React from "react";

const AuthenticatedApp = React.lazy(() => import("./authenticated-app")); //lazy内部是一个promise函数，import返回一个promise; 这种引入方法默认export时为default
const UnauthenticatedApp = React.lazy(
  () => import("./unauthenticated-app/index")
);

function App() {
  const { user } = useAuth();
  return (
    <div>
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        {/* React.Suspense是一个实验功能，最好不要用在生产环境中 */}
        <React.Suspense fallback={<FullPageLoading />}>
          {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </React.Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
