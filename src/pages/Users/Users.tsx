import { useEffect, useState } from "react";
import Card from "../../components/Card/Card";
import Container from "../../components/Container/Container";
import api from "../../utils/axios";
import Styles from "./Users.module.css";
import useAppContext from "../../context/useAppContext";
import { showToast } from "../../utils/common";
import { cardColors } from "../../data/Data";
import { useNavigate } from "react-router-dom";
import Search from "../../components/Search/Search";

interface usersType {
  _id: number;
  name: string;
  totalBillAmount: number;
  totalPaymentAmount: number;
  lastInvoiceNumber: string;
  lastInvoiceAmount: number;
  lastInvoiceDate: string;
}

const Users = () => {
  const [users, setUsers] = useState<usersType[]>();
  const [filteredUsers, setFilteredUsers] = useState<usersType[]>([]);
  const [bgIndices, setBgIndices] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { handleLoading } = useAppContext();
  const navigate = useNavigate();

  const generateRandomArray = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 15));
  };
  const getUsers = async () => {
    try {
      handleLoading(true, "Fetching clients, please wait...");
      const result = await api("/user");
      setUsers(result.data?.data || []);
      setFilteredUsers(result.data?.data || []);
      setBgIndices(generateRandomArray(result.data?.data?.length));
    } catch (error) {
      showToast(
        "error",
        error.response.data?.message || "Failed to fetch clients!"
      );
    } finally {
      handleLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase().trim())
    );
    setFilteredUsers(filtered);
  };

  const goToUserDetails = (id: number) => {
    navigate(`/users/${id}`);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Container>
      <div className={Styles.searchContainer}>
        <Search value={searchTerm} onChange={handleSearchChange} />
      </div>
      <div className={Styles.cardContainer}>
        {filteredUsers?.length > 0 &&
          filteredUsers.map((user, index) => (
            <Card
              key={user?._id}
              user={user}
              bgColor={cardColors[bgIndices[index]]}
              onClick={() => goToUserDetails(user?._id)}
            />
          ))}
      </div>
      {filteredUsers?.length === 0 && (
        <div className={Styles.noUsers}>
          <p>No clients found! with search term "{searchTerm.trim()}"</p>
        </div>
      )}
    </Container>
  );
};

export default Users;
