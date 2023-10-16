$resourceGroupName='<azure-ressource-name>'
$accountName='<azure-account-name>'
az cosmosdb sql role definition create --account-name $accountName --resource-group $resourceGroupName --body @custom-role.json