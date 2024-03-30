import { AiFillStar } from "react-icons/ai";

import Mx1 from "./Mx1";
import Register from "./Register";

export default function Hero() {
  return (
    <div className="pt-[60px] pb-[88px]">
      <Mx1 className="text-foreground flex flex-col text-center md:text-start md:items-start items-center gap-6">
        <div className="rounded-full border py-2 px-3 w-max text-sm backdrop-blur-md uppercase">
          Over 30000 users world wide
        </div>
        <h1 className="font-medium text-3xl md:text-5xl lg:text-6xl uppercase">
          We Solve Acquisition Sales for Digital Businesses
        </h1>
        <p className="text-base md:text-xl font-normal max-w-[600px] w-full">
          We build the infrastructure that allows for you to acquire clients on
          demand, and grow your business predictably.
        </p>

        <div className="flex items-center justify-between w-full mt-6 md:mt-10">
          <Register />

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, _key) => (
                <AiFillStar key={_key} className="w-5 h-5 text-primary" />
              ))}
            </div>
            <p className="text-base font-normal">Trusted by 100+ businesses</p>
          </div>
        </div>
      </Mx1>
    </div>
  );
}
