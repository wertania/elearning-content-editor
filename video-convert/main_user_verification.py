import os
import time

import logging_output as logger
from dotenv import load_dotenv
from pocketbase import PocketBase

load_dotenv()

VIDEO_UPLOAD_URL = os.getenv("VIDEO_UPLOAD_URL") or ""
POCKETBASE_ADMIN_USER = os.getenv("POCKETBASE_ADMIN_USER") or ""
POCKETBASE_ADMIN_PASSWORD = os.getenv("POCKETBASE_ADMIN_PASSWORD") or ""


class User:
    def __init__(
        self,
        email: str,
        username: str,
        name: str,
        invitation_code: str,
        codeSended: bool,
        verified: bool,
    ) -> None:
        self.id = id
        self.username = username
        self.email = email
        self.name = name
        self.invitation_code = invitation_code
        self.codeSended = codeSended
        self.verified = verified

    def __str__(self):
        return str(
            (
                self.id,
                self.username,
                self.email,
                self.name,
                self.invitation_code,
                self.codeSended,
                self.verified,
            )
        )


class InvitationCode:
    def __init__(
        self,
        id: str,
        code: str,
        domains: str,
    ) -> None:
        self.id = id
        self.code = code
        self.domains = domains

    def __str__(self):
        return str(
            (
                self.id,
                self.code,
                self.domains,
            )
        )


class PocketBaseDataProvider:
    def __init__(self) -> None:
        super().__init__()

        logger.info("Connecting to PocketBase, to: " + VIDEO_UPLOAD_URL)
        self.pb = PocketBase(VIDEO_UPLOAD_URL)
        self.pb.admins.auth_with_password(
            POCKETBASE_ADMIN_USER, POCKETBASE_ADMIN_PASSWORD
        )

    def read_unverified_users(self) -> list[User]:
        users = self.pb.collection("users").get_full_list(
            200, {"filter": f"verified = false"}
        )
        return users

    def update_user_verified(self, user: User, verified: bool):
        self.pb.collection("users").update(user.id, {"verified": verified})

    def read_invitation_codes(self) -> list[InvitationCode]:
        codes = self.pb.collection("invitationCodes").get_full_list(200, {})
        return codes


if __name__ == "__main__":
    # get users. check if the inviationcode and domain is valid. then update the user
    try:
        logger.info("Starting user verification.")
        data_provider = PocketBaseDataProvider()

        # get all users to verify
        logger.info("Fetching unverified users...")
        unverified_users = data_provider.read_unverified_users()

        logger.info(f"Found {len(unverified_users)} users to verify.")
        if len(unverified_users) > 0:
            # get all inviation codes
            invitation_codes = data_provider.read_invitation_codes()

            for user in unverified_users:
                # convert to json and print "user"
                logger.info(f"Verifying user: {user.email}")
                # log all attributes of user
                # print(user.__dict__)

                # check if the invitation code is valid and if the email domain to the given invitation code is valid
                # if valid, set verified to true
                for code in invitation_codes:
                    if code.code.lower() == user.invitation_code.lower():
                        # split domains by comma
                        domains = code.domains.split(",")
                        # remove spaces and make all lowercase
                        domains = [domain.strip().lower() for domain in domains]
                        # check if the email domain is in the domains list
                        if user.email.split("@")[1].lower() in domains:
                            logger.info(f"User {user.email} verified")
                            data_provider.update_user_verified(user, True)
                            break
                else:
                    logger.info(f"User not verified: {user}. Domain or code invalid.")

            else:
                logger.info("No users to verify. Exiting.")

    except Exception as e:
        logger.error(f"Error while fetching unverified users: {e}")

    # wait 15s
    # service will restart and run again. so this sleep will prevent the service from running too fast
    logger.info("Waiting 15s...")
    time.sleep(15)
