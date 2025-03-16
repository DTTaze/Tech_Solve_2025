import "./user-profile.css";
import Header from "../components/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function UserProfile() {
    return (
        <div>
            <Header />
            <div className="userProfile">
                <div className="userInfomation_1">
                    <div className="userInfomation_1--container">
                        <img alt="user-image" className="userImage" src="../src/assets/photos/default-avatar.jpg"></img>
                        <div>
                            <h2 className="userName">Charlie Romance</h2>
                            <p className="status">Active</p>
                        </div>
                    </div>
                    <div className="userInfomation_1--buttons">
                        <button>Chỉnh sửa hồ sơ</button>
                    </div>
                </div>
                <div className="userInformation_2">
                    <i className="fa-regular fa-circle-user"></i> 
                    <p>User ID</p> 
                    <p>user_PSLIDufknalkjsdfoiua</p>

                    <i className="fa-regular fa-id-card"></i> 
                    <p>Username</p> 
                    <p>@username</p>

                    <i className="fa-regular fa-envelope"></i> 
                    <p>Email</p> 
                    <p>adsfasdf@gmail.com</p>

                    <i className="fa-regular fa-comment"></i> 
                    <p>Phone number</p> 
                    <p>0123456789</p>
                </div>
                <div className="organizations">
                    <header>
                        <h2>Organizations</h2>
                        <p className="subtext">View user's organization memberships</p>
                    </header>

                    <div className="organizations--container">
                        <div className="organizations-card">
                            <div className="org-info">
                                <i className="fa-solid fa-globe org-icon" ></i>
                                <div className="org-details">
                                    <p className="org-name">Acme, Ltd</p>
                                    <p className="org-role">Admin</p>
                                </div>
                            </div>
                            <div className="org-right">
                                <p className="org-date">since 23 Jul, 2024</p>
                                <button className="org-options">⋮</button>
                            </div>
                        </div>
                        <hr></hr>
                        <button className="add-org-btn">+ Add to organization</button>
                    </div>
                </div>
                <div className="contactInformation">
                    <header>
                        <h2>Contact information</h2>
                        <p className="subtext">Manage user email, phone</p>
                    </header>
                    
                    <div className="contactInformation--container">
                        <h3>Email address</h3>
                        <div className="email-list">
                            <div className="email-item">
                                <p>hi@company.dev ✅</p>
                                <span>used 3 hours ago</span>
                                <span>added 23 Jul, 2024</span>
                                <button>...</button>
                            </div>
                            <div className="email-item">
                                <p>hello@personalemail.com <span className="primary">Primary</span></p>
                                <span>used 2 months ago</span>
                                <span>added 23 Jul, 2024</span>
                                <button>...</button>
                            </div>
                            <div className="email-item">
                                <p>charlie_ro@gmail.com <span className="unverified">Unverified</span></p>
                                <span>used 1 year ago</span>
                                <span>added 23 Jul, 2024</span>
                                <button>...</button>
                            </div>
                        </div>
                        <button className="add-btn">+ Add email</button>

                        <h3>Phone numbers</h3>
                        <div className="phone-list">
                            <div className="phone-item">
                                <p>(+44) 141 556-9988 ✅</p>
                                <span>used never</span>
                                <span>added 23 Jul, 2024</span>
                                <button>...</button>
                            </div>
                            <div className="phone-item">
                                <p>(+44) 141 556-9988 <span className="primary">Primary</span></p>
                                <span>used 14 days ago</span>
                                <span>added 23 Jul, 2024</span>
                                <button>...</button>
                            </div>
                        </div>
                        <button className="add-btn">+ Add phone</button>
                    </div>
                </div>
                <div className="socialAccounts">
                    <header>
                        <h2>Social Accounts</h2>
                        <p className="subtext">Manage social accounts</p>
                    </header>
                    
                    <div className="socialAccounts--container">
                        <div className="accounts-list">
                            <div className="accounts-item">
                                <p>Facebook <span>@charlie_r</span></p>
                                <span>used 14 days ago</span>
                                <span>added 23 Jul, 2024</span>
                                <button>...</button>
                            </div>
                            <div className="accounts-item">
                                <p>Google <span>charlie_r@gmail.com</span> </p>
                                <span>used 2 months ago</span>
                                <span>added 23 Jul, 2024</span>
                                <button>...</button>
                            </div>
                        </div>
                        <button className="add-btn">+ Add more</button>
                    </div>
                </div>
                <div className="userActivity">
            </div>
            </div>
        </div>
    );
}

export default UserProfile;