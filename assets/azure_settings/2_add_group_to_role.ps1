$resourceGroupName='<azure-ressource-name>'
$accountName='<azure-account-name>'
$group_id=$(az ad group show --group "Some AD group" --query id --output tsv)
$result = az cosmosdb sql role definition list --account-name $accountName --resource-group $resourceGroupName --query "[?roleName=='my-custom-role']"
$roleId = ($result | ConvertFrom-Json).name
# debug
echo "group_id = $group_id"
echo "roleId = $roleId"

az cosmosdb sql role assignment create --account-name $accountName --resource-group $resourceGroupName --scope "/dbs/elearning/colls/media" --principal-id $group_id --role-definition-id $roleId
