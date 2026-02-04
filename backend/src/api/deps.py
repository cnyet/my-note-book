from typing import List
from fastapi import Depends, HTTPException, status
from src.api.v1.auth import get_current_user
from src.models.user import User


class PermissionChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)):
        if user.role not in self.allowed_roles and not user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have enough permissions to perform this action",
            )
        return user


# Common permission sets
admin_only = PermissionChecker(["admin"])
editor_only = PermissionChecker(["admin", "editor"])
