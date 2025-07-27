import React from 'react';
import { useParams } from 'react-router-dom';

const UserProfile = ({ users }) => {
  const { userName } = useParams();
  const user = users.find(u => u.name === userName);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="user-profile">
      <h1>{user.name}'s Profile</h1>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Gender:</strong> {user.gender}</p>
      <p><strong>Time Spent:</strong> {user.time_spent} hours</p>
      <p><strong>Platform:</strong> {user.platform}</p>
      <p><strong>Interests:</strong> {user.interests}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Demographics:</strong> {user.demographics}</p>
      <p><strong>Profession:</strong> {user.profession}</p>
      <p><strong>Income:</strong> ${user.income}</p>
      <p><strong>Indebt:</strong> {user.indebt ? 'Yes' : 'No'}</p>
      <p><strong>Home Owner:</strong> {user.isHomeOwner ? 'Yes' : 'No'}</p>
      <p><strong>Owns Car:</strong> {user.Owns_Car ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default UserProfile;