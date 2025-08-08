import { UserCard } from "../components/UserCard";
import { cleanUser } from "../libs/CleanUser";
import axios from "axios";
import { useEffect, useState } from "react";
export default function RandomUserPage() {
  const [users, setUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [genAmount, setGenAmount] = useState(1);

  useEffect(() => {
    const genA = localStorage.getItem("genAmount");
    if (genA === null) {
      return;
    }
    const strGenA = JSON.parse(genA);
    setGenAmount(strGenA);
  }, []);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    const strGenA = JSON.stringify(genAmount);
    localStorage.setItem("genAmount", strGenA);
  }, [genAmount]);

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    const users = resp.data.results;
    const CleanedUser = users.map((i: any) => cleanUser(i));
    setUsers(CleanedUser);
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(event: any) => setGenAmount(event.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users &&
        !isLoading &&
        users.map((x: any) => (
          <UserCard
            name={x.name}
            imgUrl={x.imgUrl}
            address={x.address}
            email={x.email}
          />
        ))}
    </div>
  );
}
