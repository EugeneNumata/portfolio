import sys

oniki = [
        'lowF', 'lowF_s', 'lowG', 'lowG_s',
        'mid1A', 'mid1A_s', 'mid1B', 'mid1C', 'mid1C_s', 'mid1D', 'mid1D_s', 'mid1E', 'mid1F', 'mid1F_s', 'mid1G', 'mid1G_s',
        'mid2A', 'mid2A_s', 'mid2B', 'mid2C', 'mid2C_s', 'mid2D', 'mid2D_s', 'mid2E', 'mid2F', 'mid2F_s', 'mid2G', 'mid2G_s',
        'hiA', 'hiA_s', 'hiB', 'hiC', 'hiC_s', 'hiD', 'hiD_s', 'hiE', 'hiF', 'hiF_s', 'hiG', 'hiG_s',
        'hihiA', 'hihiA_s', 'hihiB', 'hihiC', 'hihiC_s', 'hihiD', 'hihiD_s', 'hihiF', 'hihiF_s']

def printAdjustKey(adjust_type, diff_key):
    if   adjust_type == '1OctaveDown': ad_oc = 12
    elif adjust_type == '2OctaveDown': ad_oc = 24
    elif adjust_type == '1OctaveUp'  : ad_oc = -12
    elif adjust_type == '2OctaveUp'  : ad_oc = -24
    else: ad_oc = 0

    print(adjust_type + '\t:\t', diff_key + ad_oc, end='\t')
    if abs(diff_key + ad_oc) > 7: print('x')
    else: print('o')

def Usage():
    print('Usage: python3 karaoke.py [your key] [key your want to sing]')
    print('ex   : python3 karaoke.py mid2G_s hiC_s')

    print('Kind of range:')
    cnt = 1
    for key in oniki:
        print(key, end = ' ')
        cnt += 1
        if cnt % 10 == 0: print('')
    sys.exit()

def validation(argv):
    if len(argv) != 3: Usage()
    your_key = argv[1]
    target_key = argv[2]

    dict_oniki = {x:i for i, x in enumerate(oniki)}
    if your_key not in dict_oniki or target_key not in dict_oniki:
        Usage()

    return dict_oniki, your_key, target_key

def main(argv):
    dict_oniki, your_key, target_key = validation(argv)
    print('Key that you can sing    : ', your_key)
    print('Key that you want to sing: ', target_key)
    print('')

    print('To adjust key')
    diff_key_num = dict_oniki[your_key] - dict_oniki[target_key]
    printAdjustKey('Original', diff_key_num)
    printAdjustKey('1OctaveDown', diff_key_num)
    printAdjustKey('1OctaveUp', diff_key_num)
    print('');
    printAdjustKey('2OctaveDown', diff_key_num)
    printAdjustKey('2OctaveUp', diff_key_num)

if __name__ == "__main__":
    main(sys.argv)