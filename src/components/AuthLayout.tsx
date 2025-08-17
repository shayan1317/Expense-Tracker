import { useTransactionStore } from "../../store/useTransactionStore";

type Props = React.PropsWithChildren<{}>;
const AuthLayout = ({ children }: Props) => {
  return (
    <div className="h-screen w-screen overflow-auto px-12 pt-20 flex justify-center">
      {/* Left Side - Login Form */}
      <div className="w-[40vw] flex flex-col justify-center items-center">
        <h1 className="text-[clamp(1.25rem,2.5vw,2.5rem)] font-medium mb-1 text-start">
          Expense Tracker
        </h1>
        <div className="flex-1 flex items-center w-full">
          <div className="w-full"> {children}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
