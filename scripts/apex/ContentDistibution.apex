ContentDistribution distribution = new ContentDistribution();
distribution.ContentVersionId = '0688e00000BzBSnAAN';
distribution.Name = 'Quote';
distribution.PreferencesAllowOriginalDownload = true;
distribution.PreferencesAllowViewInBrowser = true;
distribution.PreferencesNotifyOnVisit = true;

insert distribution;
ContentDistribution cd = [
  SELECT Id, ContentDownloadUrl,DistributionPublicUrl
  FROM ContentDistribution
  WHERE Id = :distribution.Id
];
String DownloadUrl = cd.ContentDownloadUrl;
String PublicUrl = cd.DistributionPublicUrl;
System.debug('DownloadUrl: ' + DownloadUrl);
System.debug('PublicUrl: ' + PublicUrl);
