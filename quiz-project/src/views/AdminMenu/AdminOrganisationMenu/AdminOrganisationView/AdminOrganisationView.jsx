import {Container, ListGroup} from "react-bootstrap";
import {AdminUserMenuItem} from "../../../../components/adminComponents/AdminUserManagement/AdminUserMenuItem.jsx";
import {useEffect, useState} from "react";
import {getAllOrganizations} from "../../../../services/organization.service.js";
import {
    AdminOrganizationItem
} from "../../../../components/adminComponents/AdminOrganizationManagement/AdminOrganizationItem.jsx";
import {editUserByUserId} from "../../../../services/user.service.js";
import {toast} from "react-toastify";
import React from "react";

export const AdminOrganisationView = () => {

    const [organizationData, setOrganizationData] = useState([{
        id: 'header',
        name: 'Name',
        description: 'Description',
        email: 'Email',
        educators: 'Educators',
        owner: 'Owner',
    }]);

    const [ editOrgId, setEditOrgId ] = useState(null); // State to track the user being edited

    useEffect(() => {
        const fetchOrganizations = async () => {
            const organizations = await getAllOrganizations();
            setOrganizationData(prevState => [...prevState, ...organizations]);
        }
        fetchOrganizations();
    },[]);

    const handleEditClick = (orgId) => {
        setEditOrgId(orgId); // Set the user to be edited
    };

    const handleInputChange = (e, orgId, field) => {
        const newOrgData = organizationData.map(organization => {
            if (organization.id === orgId) {
                return { ...organization, [field]: e.target.value };
            }
            return organization;
        });
        setOrganizationData(newOrgData); // Update the user data state
    };

    const handleSave = async (orgId) => {

        const organizationToBeEdited = organizationData.filter(organization => organization.uid === orgId)[0];

        setEditOrgId(null); // Disable edit mode after saving

        try {
            await editOrganizationById(orgId, organizationToBeEdited);
        } catch (e) {
            toast.error(e)
        }
    };

    return (
        <Container>
            <ListGroup>
                {organizationData.map((organization) => (
                    <AdminOrganizationItem key={organization.uid}
                                           organization={organization}
                                           editOrgId={editOrgId}
                                           handleInputChange={handleInputChange}
                                           handleSave={handleSave}
                                           handleEditClick={handleEditClick} />
                ))}
            </ListGroup>
        </Container>
    )
}
