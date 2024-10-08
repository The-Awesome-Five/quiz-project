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
        students: 'Students',
        owner: 'Owner',
    }]);

    const [ editOrgId, setEditOrgId ] = useState(null);

    useEffect(() => {
        const fetchOrganizations = async () => {
            const organizations = await getAllOrganizations();
            organizations && setOrganizationData(prevState => [...prevState, ...organizations]);
        }
        fetchOrganizations();
    },[]);

    const handleEditClick = (orgId) => {
        setEditOrgId(orgId);
    };

    const handleInputChange = (e, orgId, field) => {
        const newOrgData = organizationData.map(organization => {
            if (organization.id === orgId) {
                return { ...organization, [field]: e.target.value };
            }
            return organization;
        });
        setOrganizationData(newOrgData);
    };

    const handleSave = async (orgId) => {

        const organizationToBeEdited = organizationData.filter(organization => organization.uid === orgId)[0];

        setEditOrgId(null);

        try {
            await editOrganizationById(orgId, organizationToBeEdited);
        } catch (e) {
            toast.error(e)
        }
    };

    return (
        <Container>
            <ListGroup>
                {organizationData.length < 2 ?
                    <h1>No Organizations</h1>
                    : organizationData.map((organization) => (
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
