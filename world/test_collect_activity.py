import os, subprocess, unittest
from unittest.mock import patch
import collect_activity as activity

class CollectionTests(unittest.TestCase):
    def test_private_repository_stops_before_reading_runs_or_reviews(self):
        with patch.object(activity,'gh',return_value={'private':True}) as request:
            result=activity.repository('example/private')
        self.assertEqual(request.call_count,1)
        self.assertEqual(result[0]['state'],'unknown')
        self.assertNotIn('url',result[0] if result[0].get('url') else {})

    def test_only_named_running_supervisors_count(self):
        rows='123\t0\tcom.apizzamichigan.classifier\n-\t0\tcom.apizzamichigan.scraper\n999\t0\tunrelated.secret\n'
        with patch.dict(os.environ,{'TOWN_FOOD_SSH_HOST':'test-host'}), patch.object(activity.subprocess,'run',return_value=subprocess.CompletedProcess([],0,rows,'')):
            result=activity.food_runtime()[0]
        self.assertEqual(result['state'],'running')
        self.assertIn('1 of 2',result['detail'])
        self.assertNotIn('123',str(result));self.assertNotIn('test-host',str(result));self.assertNotIn('secret',str(result))

    def test_ssh_failure_does_not_export_stderr_or_claim_offline(self):
        with patch.dict(os.environ,{'TOWN_FOOD_SSH_HOST':'private-host'}), patch.object(activity.subprocess,'run',side_effect=subprocess.CalledProcessError(255,[],stderr='sensitive information')):
            result=activity.food_runtime()[0]
        self.assertEqual(result['state'],'unknown')
        self.assertNotIn('sensitive',str(result));self.assertNotIn('private-host',str(result))

if __name__=='__main__': unittest.main()
