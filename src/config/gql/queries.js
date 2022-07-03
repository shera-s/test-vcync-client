import { gql } from "@apollo/client";

const USERS = gql`
  query {
    getUsers {
      id
      name
      phoneNumber
    }
  }
`;
const GET_PROFILE = gql`
  query Profile($id: ID) {
    getProfilebyId(id: $id) {
      user_id
      qrCode
      enable
      profiletype
      userDetails {
        user_id
          firstName
          lastName
          workEmail
          workPhone
          organization
          title
          birthday
          url
          note
          photo
      }
      socialData {
        platform
        username
      }
      extraInfo {
        extraInfo
      }
    }
  }
`;

const DOWN_VCF = gql`
query ($id:ID){
  generatevcffile(id:$id){
    firstName
    file
  }
}
`
const DOWN_PKPASS = gql`
query ($id:ID){
  generatepkpass(id:$id){
    firstName
    file
  }
}
`

export { USERS, GET_PROFILE , DOWN_VCF, DOWN_PKPASS};
